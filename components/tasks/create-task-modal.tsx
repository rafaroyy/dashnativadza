"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createTask } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

interface CreateTaskModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  spaces: { id: string; name: string }[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-digitalz-cyan text-black hover:bg-digitalz-cyan-light">
      {pending ? "Criando..." : "Criar Tarefa"}
    </Button>
  )
}

export default function CreateTaskModal({ isOpen, setIsOpen, spaces }: CreateTaskModalProps) {
  const initialState = { errors: {}, message: null }
  const [state, dispatch] = useFormState(createTask, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message) {
      toast.success(state.message)
      setIsOpen(false)
      formRef.current?.reset()
    }
    if (state.errors?._form) {
      toast.error(state.errors._form.join(", "))
    }
  }, [state, setIsOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-digitalz-dark-secondary border-digitalz-border text-white">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <form action={dispatch} ref={formRef} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input id="title" name="title" required className="bg-digitalz-gray border-digitalz-border" />
            {state.errors?.title && <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="space_id">Espaço</Label>
            <Select name="space_id" required>
              <SelectTrigger className="bg-digitalz-gray border-digitalz-border">
                <SelectValue placeholder="Selecione um espaço" />
              </SelectTrigger>
              <SelectContent className="bg-digitalz-dark-secondary border-digitalz-border text-white">
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.space_id && <p className="text-red-500 text-sm mt-1">{state.errors.space_id}</p>}
          </div>
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select name="priority" defaultValue="normal">
              <SelectTrigger className="bg-digitalz-gray border-digitalz-border">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent className="bg-digitalz-dark-secondary border-digitalz-border text-white">
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
