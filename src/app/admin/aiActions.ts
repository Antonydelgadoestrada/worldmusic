'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Client } from '@gradio/client';

const apiKey = process.env.GEMINI_API_KEY;

export async function generateDescriptionWithIAAction(titulo: string, imageUrl: string) {
  try {
    if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.trim() === '') {
      return { 
        error: 'La clave de API de Gemini no está configurada. Por favor, asegúrate de ingresar tu GEMINI_API_KEY en las variables de entorno de Vercel o en tu archivo .env local.' 
      };
    }

    if (!imageUrl) {
      return { error: 'Por favor, sube o selecciona una imagen primero para que la Inteligencia Artificial pueda analizar el instrumento.' };
    }

    // 1. Descargar la imagen de Supabase Storage en memoria
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('No se pudo descargar la imagen para el análisis de la IA.');
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    const base64Data = buffer.toString('base64');

    // 2. Inicializar el cliente SDK de Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Usamos el modelo rápido y de alto rendimiento gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 3. Redactar el Prompt para un tono comercial y orientado a música
    const prompt = `Genera una descripción detallada, atractiva y comercial en español para un instrumento musical titulado "${titulo}". Explica sus características más notorias apreciables en la foto, maderas/materiales de construcción, su tipo de sonido y para qué niveles de músico (principiante, intermedio o avanzado) es idóneo. Limítate estrictamente a un único párrafo de máximo 3 o 4 líneas. Evita usar viñetas o listas. Sé directo, persuasivo y entusiasta.`;

    // 4. Enviar a Gemini para análisis multimodal
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType,
      },
      },
    ]);

    const text = result.response.text();
    return { success: true, description: text.trim() };
  } catch (error: any) {
    console.error('Error en generateDescriptionWithIAAction:', error);
    return { error: 'Error al generar la descripción: ' + error.message };
  }
}

export async function removeBackgroundAction(imageUrl: string) {
  try {
    if (!imageUrl) {
      return { error: 'No se proporcionó la URL de la imagen.' };
    }

    // Conectar a Hugging Face Space ZhengPeng7/BiRefNet_demo
    const app = await Client.connect('ZhengPeng7/BiRefNet_demo');
    
    const result = await app.predict('/URL', {
      images: imageUrl,
      resolution: '1024x1024',
      weights_file: 'General'
    }) as any;

    if (result && result.data && result.data[0] && result.data[0][1]) {
      const transparentImageUrl = result.data[0][1].url;
      
      // Descargar la imagen transparente y convertirla a base64 Data URL
      const imgResponse = await fetch(transparentImageUrl);
      if (!imgResponse.ok) {
        throw new Error('No se pudo descargar la imagen procesada de los servidores de IA.');
      }
      
      const arrayBuffer = await imgResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = imgResponse.headers.get('content-type') || 'image/png';
      const base64Data = buffer.toString('base64');
      const base64DataUrl = `data:${mimeType};base64,${base64Data}`;

      return { success: true, transparentImageUrl: base64DataUrl };
    } else {
      return { error: 'La IA de remoción de fondo no devolvió un resultado válido.' };
    }
  } catch (error: any) {
    console.error('Error en removeBackgroundAction:', error);
    return { error: 'Error del servidor de IA (Hugging Face): ' + error.message };
  }
}
