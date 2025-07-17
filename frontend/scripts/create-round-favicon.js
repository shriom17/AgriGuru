const Jimp = require('jimp');
const path = require('path');

async function createRoundFavicon() {
    try {
        // Read the source image
        const image = await Jimp.read(path.join(__dirname, '../public/logo.png'));
        
        // Create a circular mask
        const mask = new Jimp(image.getWidth(), image.getHeight(), 0x00000000);
        mask.circle();
        
        // Resize the image to common favicon sizes and apply mask
        const sizes = [16, 32, 48, 64, 192, 512];
        
        for (const size of sizes) {
            const resized = image.clone()
                .resize(size, size)
                .mask(mask.clone().resize(size, size), 0, 0);
            
            if (size <= 64) {
                await resized.writeAsync(path.join(__dirname, `../public/favicon-${size}.png`));
            } else {
                await resized.writeAsync(path.join(__dirname, `../public/logo${size}.png`));
            }
        }
        
        console.log('Round favicons created successfully!');
    } catch (err) {
        console.error('Error creating favicons:', err);
    }
}

createRoundFavicon();
