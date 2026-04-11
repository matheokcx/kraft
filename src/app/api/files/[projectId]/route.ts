import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FILE_LIMIT_SIZE, getMimeType } from "@/utils/utils";
import fs, { writeFile } from 'fs/promises';
import path from 'path';



export async function GET(request: NextRequest, { params }: { params: Promise<{projectId: string}>}): Promise<NextResponse> {
    const { projectId } = await params;
    const session = await getServerSession(authOptions);

    if(!session?.user){
        return NextResponse.json(
            {error: "Vous avez besoin d'être connecté afin de pouvoir récupérer les fichiers d'un projet"},
            {status: 401}
        );
    }

    const files = await prismaClient.file.findMany({
        where: {
            projectId: Number(projectId),
            project: {
                client: {
                    freelanceId: Number(session.user.id),
                }
            }
        }
    });

    try{
        const filesData = await Promise.all(files.map(async (file) => {
            const filePath: string = path.join(process.cwd(), file.path);

            try {
                const fileBuffer = await fs.readFile(filePath);
                const base64Content: string = fileBuffer.toString('base64');

                return {
                    id: file.id,
                    name: path.basename(file.path),
                    mimeType: getMimeType(file.path),
                    content: base64Content,
                    size: fileBuffer.length
                };
            }
            catch (error) {
                console.error(`Erreur lecture fichier ${file.path}`, error);
                return null;
            }
        }));

        const validFiles = filesData.filter((file) => file !== null);
        return NextResponse.json(validFiles, { status: 200 });
    }
    catch (error){
        return NextResponse.json({ error: "Fichier(s) non trouvé(s)" }, { status: 404 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{projectId: string}>}): Promise<NextResponse> {
    const { projectId } = await params;
    const session = await getServerSession(authOptions);
    const formData: FormData = await request.formData();
    const files = formData.getAll("file") as File[];
    const acceptedFileFormats: string[] = ["image/png", "image/jpeg", "image/webp", "application/pdf", "text/csv"];

    if(!session?.user){
        return NextResponse.json({error: "Vous devez être connecté afin de pouvoir envoyer des fichiers"}, {status: 401});
    }

    if(!files){
        return NextResponse.json({error: "Fichier(s) non récupéré(s)"}, {status: 400});
    }

    for (const file of files) {
        if(file.size > FILE_LIMIT_SIZE){
            return NextResponse.json({error: `Fichier '${file.name}' trop volumineux`}, {status: 400});
        }

        if(!acceptedFileFormats.includes(file.type)){
            return NextResponse.json({error: `Format de fichier '${file.name}' non-conforme`}, {status: 400});
        }
    }

    const project = await prismaClient.project.findUnique({
        where: {
            id: Number(projectId),
            client: {
                freelanceId: Number(session.user.id)
            }
        }
    });

    if(!project){
        return NextResponse.json(
            {error: "Vous ne pouvez pas ajouter de fichier au un projet d'un client qui n'est pas le vôtre"},
            {status: 401}
        );
    }

    try{
        // await Promise.all(files.map(async (file) => {
        //     const bytes = await file.arrayBuffer();
        //     const buffer = Buffer.from(bytes);
        //     const time = Date.now();
        //
        //     const uploadDirectoryPath: string = path.join(process.cwd(), process.env.FILES_DIRECTORY ?? "public/files");
        //     const fileName: string = `${time}-${file.name}`
        //     const newFilePath: string = path.join(uploadDirectoryPath, fileName);
        //
        //     await writeFile(newFilePath, buffer);
        //
        //     await prismaClient.file.create({
        //         data: {
        //             name: `${time}-${file.name.split(".")[0]}`,
        //             path: `${process.env.FILES_DIRECTORY}/${fileName}`,
        //             type: file.name.split(".")[1],
        //             projectId: Number(projectId)
        //         }
        //     });
        // }));

        return NextResponse.json("Fichier(s) ajouté(s) avec succès", { status: 201 });
    }
    catch(error){
        return NextResponse.json(
            {error: "Un problème est survenue lors de l'upload du/des fichier(s)"},
            {status: 500}
        );
    }
}
