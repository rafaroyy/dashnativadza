"use client"
import { useSelector } from "react-redux"
import groupTasks, { groupableValues } from "../../../utils/taskAlgorithms/groupAlgorithm"
import KanbanBoardClient from "./kanban-board-client"

function convertToKanbanFormat(taskData, availableStatuses) {
  const lanes = []

  availableStatuses.forEach((status) => {
    const currentColumn = {
      id: status._id,
      title: status.status,
      lanes: [],
      style: { borderTop: `3px solid ${status.color}` },
    }

    const currentCards = []
    taskData[status._id].tasks.forEach((task, idx) => {
      currentCards.push({
        id: task._id,
        title: task.name,
        parent: task.parent.name,
        parentId: task.parent.id,
        priority: task.priority,
      })
    })

    currentColumn.cards = currentCards
    lanes.push(currentColumn)
  })

  console.log("Lanes", lanes)
  return { lanes: lanes.sort((a, b) => a.cards.length < b.cards.length) }
}

function GridView({ data, availableStatuses }) {
  const statuses = useSelector((state) => state.metaReducer.statuses)
  const sorted = groupTasks(data, groupableValues.STATUS, statuses)

  const kanbanFormat = convertToKanbanFormat(sorted, availableStatuses)

  return (
    <div style={{ padding: "15px 0px" }}>
      <KanbanBoardClient initialBoard={kanbanFormat} />
    </div>
  )
}

export default GridView
