'use server'

import { prisma } from './db'

export async function createSession(projectName: string) {
  const project = await prisma.project.upsert({
    where: { name: projectName },
    update: {},
    create: { name: projectName }
  })

  // Crea nuova sessione
  const session = await prisma.session.create({
    data: {
      projectId: project.id,
      startTime: new Date(),
      endTime: new Date(), // Temporaneo, verrà aggiornato
      duration: 0
    }
  })

  return session.id
}

export async function updateSession(sessionId: string, duration: number) {
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      endTime: new Date(),
      duration: duration
    }
  })
}

export async function getPausedSessions() {
  return await prisma.session.findMany({
/*     where: {
      duration: 0 // Sessioni non completate
    }, */
    include: {
      project: true
    },
    orderBy: {
      startTime: 'desc'
    }
  })
}

export async function deleteSession(sessionId: string) {
  await prisma.session.delete({
    where: { id: sessionId }
  })
}

export async function getAllSessions() {
  // Recupera TUTTE le sessioni
  return await prisma.session.findMany({
      include: { project: true },
      orderBy: { startTime: 'desc' }
  });
}