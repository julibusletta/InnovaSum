import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      dni, 
      phone,
      street, 
      number, 
      city, 
      state, 
      zip 
    } = body;

    // Validación básica
    if (!email || !password || !firstName || !lastName || !dni) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El correo electrónico ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dni,
      phone,
      role: 'user', // Rol por defecto
      address: {
        street,
        number,
        city,
        state,
        zip
      }
    };

    // Guardar en la base de datos
    await db.saveUser(newUser);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error: any) {
    console.error('Error in registration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}
