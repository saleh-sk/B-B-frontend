import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import CategoryForm, {
  type CategoryFormValues,
} from '../../../components/logistics/CategoryForm'
import categoriesData from '../../../json/categories.json'
import type { Category } from '../../../types/category.types'

const EditCategory = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>(() => {
    const storedCategories = localStorage.getItem('categories')

    if (!storedCategories) {
      return categoriesData as Category[]
    }

    try {
      const parsed = JSON.parse(storedCategories) as Category[]
      return parsed.length ? parsed : (categoriesData as Category[])
    } catch {
      return categoriesData as Category[]
    }
  })

  const categoryId = Number(id)

  const selectedCategory = useMemo(
    () => categories.find(category => category.id === categoryId),
    [categories, categoryId],
  )

  const initialValues = useMemo<CategoryFormValues | undefined>(() => {
    if (!selectedCategory) {
      return undefined
    }

    return {
      name: selectedCategory.name,
      type: selectedCategory.type,
    }
  }, [selectedCategory])

  useEffect(() => {
    if (!id || Number.isNaN(categoryId)) {
      toast.error('Invalid category id.')
      navigate('/logistics/categories')
      return
    }

    if (!selectedCategory) {
      toast.error('Category not found.')
      navigate('/logistics/categories')
    }
  }, [id, categoryId, selectedCategory, navigate])

  const handleUpdateCategory = (formValues: CategoryFormValues) => {
    const alreadyExists = categories.some(
      category =>
        category.id !== categoryId &&
        category.name.toLowerCase() === formValues.name.toLowerCase() &&
        category.type.toLowerCase() === formValues.type.toLowerCase(),
    )

    if (alreadyExists) {
      toast.error('This category already exists.')
      return
    }

    const updatedCategories = categories.map(category => {
      if (category.id !== categoryId) {
        return category
      }

      return {
        ...category,
        name: formValues.name,
        type: formValues.type,
      }
    })

    setCategories(updatedCategories)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))
    toast.success(`Category "${formValues.name}" updated successfully.`)
    navigate('/logistics/categories')
  }

  if (!initialValues) {
    return null
  }

  return (
    <CategoryForm
      key={categoryId}
      mode='edit'
      categoryId={categoryId}
      initialValues={initialValues}
      onSubmit={handleUpdateCategory}
    />
  )
}

export default EditCategory
