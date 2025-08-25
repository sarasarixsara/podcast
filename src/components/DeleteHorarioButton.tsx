"use client"

interface DeleteHorarioButtonProps {
  horarioId: number
  className?: string
  children: React.ReactNode
}

export default function DeleteHorarioButton({ horarioId, className, children }: DeleteHorarioButtonProps) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={`/api/admin/agenda/${horarioId}/delete`} method="POST">
      <button
        type="submit"
        className={className}
        onClick={handleDelete}
      >
        {children}
      </button>
    </form>
  )
}
