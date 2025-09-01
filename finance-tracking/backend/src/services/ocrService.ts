import vision from "@google-cloud/vision"
import fs from "fs"

interface ReceiptData{
    merchant:string| null,
    date:string|null,
    total:string|null,
    rawText:string
}

const client = new vision.ImageAnnotatorClient({
    keyFilename:process.env.GOOGLE_VISION_API_KEY_FILE  // e.g. ./gcloud-key.json
})

function parseReceiptText(text:string):ReceiptData{
    const lines = text.split("\n");

    const merchant = lines[0] || null;
    let total:string|null = null;
    let date:string|null = null;

     // Regex to match date formats like 2025/08/29, 29.08.2025, etc.
    const dateRegex = /\d{2,4}[\/\.-]\d{1,2}[\/\.-]\d{1,4}/;
    // Regex to find total or amount with a number, case insensitive
    const totalRegex = /(total|amount)[^\d]*(\d+[\.,]?\d{0,2})/i;

    for(const line of lines){
        if(!date && dateRegex.test(line)){
            const match = line.match(dateRegex);
            if(match){
                date = match[0];
            }
        }

        if(!total && totalRegex.test(line)){
            const match = line.match(totalRegex);

            if(match){
                total = match[2];
            }
        }
    }

    return {
        merchant,
        date,
        total,
        rawText:text
    }
}

export async function extractReceiptDate(filePath:string) : Promise<ReceiptData>{
    const [result] = await client.textDetection(filePath);
    const detections  = result.textAnnotations;
    
    const rawText= detections?.[0].description || "";

    return parseReceiptText(rawText);
}