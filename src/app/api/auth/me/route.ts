import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { User } from "@/types";

export async function GET(request: NextRequest) {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Vous n'êtes pas connecté" }, { status: 401 });
    }

    const currentUser: User | null = await prismaClient.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    if (!currentUser) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = currentUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
}
