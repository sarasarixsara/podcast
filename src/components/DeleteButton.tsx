"use client"

interface DeleteButtonProps {
  horarioId: number
}

export default function DeleteButton({ horarioId }: DeleteButtonProps) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={`/api/admin/agenda/${horarioId}/delete`} method="POST">
      <button
        type="submit"
        className="text-red-600 hover:text-red-900"
        onClick={handleDelete}
      >
        Eliminar
      </button>
    </form>
  )
}
