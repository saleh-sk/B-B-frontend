import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import CategoryForm, {
  type CategoryFormValues,
} from '../../../components/logistics/CategoryForm'
import type { Category } from '../../../types/category.types'

const AddCategory = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const storedCategories = localStorage.getItem('categories')

    if (!storedCategories) {
      return []
    }

    try {
      return JSON.parse(storedCategories) as Category[]
    } catch {
      return []
    }
  })
  const nextId = useMemo(() => {
    if (!categories.length) {
      return 1
    }

    return Math.max(...categories.map(category => category.id)) + 1
  }, [categories])

  const handleCreateCategory = (formValues: CategoryFormValues) => {
    const alreadyExists = categories.some(
      category =>
        category.name.toLowerCase() === formValues.name.toLowerCase() &&
        category.type.toLowerCase() === formValues.type.toLowerCase(),
    )

    if (alreadyExists) {
      toast.error('This category already exists.')
      return
    }

    const newCategory: Category = {
      id: nextId,
      name: formValues.name,
      type: formValues.type,
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))
    toast.success(`Category "${newCategory.name}" created successfully.`)
  }

  return <CategoryForm mode='create' onSubmit={handleCreateCategory} />
}

export default AddCategory
