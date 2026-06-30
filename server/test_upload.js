import fs from 'fs';
import path from 'path';

async function test() {
    try {
        const apiKey = '30abce10cd582f4e4c62e89a27e2c38c';
        const imgPath = path.join(process.cwd(), '../docs/Architecture.png');
        const imgBuffer = fs.readFileSync(imgPath);
        const base64Data = imgBuffer.toString('base64');

        const formData = new FormData();
        formData.append('image', base64Data);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log("Response:", response.status, data);
    } catch(err) {
        console.error("Test failed:", err);
    }
}
test();
