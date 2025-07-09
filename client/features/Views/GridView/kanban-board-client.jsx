"use client"

import dynamic from "next/dynamic"

/* Carregamos o Kanban em lazy-load; o runtime do App Router
   já lida com a renderização apenas no cliente, portanto não
   usamos a flag `ssr:false`.                                           */
const KanbanBoard = dynamic(() => import("./Kanban"), {
  loading: () => <p>Loading…</p>,
})

export default function KanbanBoardClient(props) {
  return <KanbanBoard {...props} />
}
