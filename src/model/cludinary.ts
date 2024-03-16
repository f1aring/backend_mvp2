import pdf2img from 'pdf-img-convert';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dr3buczbc',
  api_key: '831329449195399',
  api_secret: 'btaBipINGy-1682Mzut_cMwr9qk'
});

export async function convertPDFToImagesAndUpload(pdfPath: string): Promise<string[]> {
    try {
        const outputImages = await pdf2img.convert(pdfPath);
        const imageUrls: string[] = [];

        for (let i = 0; i < outputImages.length; i++) {
            // Convert image buffer to stream
            const imageStream = Readable.from(outputImages[i]);
            // Upload image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload_stream({
                folder: 'pdf_images', // Specify folder where images will be stored
                public_id: `image${i}`, // Specify public_id for the image
                overwrite: true // Overwrite image if it already exists
            }, async (error, result) => {
                if (error) {
                    console.error("Error uploading image to Cloudinary: ", error);
                } else if (result) { // Check if result is not null
                    // Push the URL of the uploaded image to the array
                    imageUrls.push(result.secure_url);
                }
            });

            // Pipe image stream to Cloudinary upload stream
            imageStream.pipe(uploadedImage);
        }

        return imageUrls;
    } catch (error) {
        console.error("Error converting PDF to images: ", error);
        return [];
    }
}
