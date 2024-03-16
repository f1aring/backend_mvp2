import { setUser, getUser } from "../model/PDF/pdf.query";
import { Request, Response } from "express";
import multer from 'multer';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';


const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })

export const getPDF = async (req: Request, res: Response) => {
    try {
        const user = await getUser();
        res.json(user)
    } catch (error) {
        console.log(error)
    }
}

export const newUser = async (req: Request, res: Response) => {
   
    try {
        // Access uploaded files from req.files array
        const uploadedFiles = req.files as Express.Multer.File[];
        // Extract other form data such as name and account number from req.body
        const { name, account_number } = req.body;
        // Check if files were uploaded
        if (uploadedFiles.length < 2) {
            return res.status(400).send('Please upload 2 files');
        }
    

        // Assuming the files are uploaded in the correct order, get pdfData1 and pdfData2
        const pdfData1 =  fs.readFileSync(uploadedFiles[0].path);
        const pdfData2 =  fs.readFileSync(uploadedFiles[1].path);
        
        // Call setUser function to create a new user with the provided data
        await setUser(name, account_number);

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const pdfBytes1 = await pdfDoc.embedPng(pdfData1);
        const pdfBytes2 = await pdfDoc.embedPng(pdfData2);
        const pdfBytes = await pdfDoc.save();
        console.log(pdfBytes)

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }

}