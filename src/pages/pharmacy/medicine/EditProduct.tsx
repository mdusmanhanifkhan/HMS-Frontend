import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'
import Dropdown from '../../../components/input/Dropdown'
import { routePaths } from '../../../constants/routePaths'
import ErrorMessage from '../../../components/error-handling/ErrorMessage'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'

/* ================= TYPES ================= */
interface Option {
  id: number | string
  name: string
}

interface VariantForm {
  varientName?: string
  sku?: string
  strength?: number
  strengthUnit?: Option | null
  packingType?: Option | null
  packQuantity?: number
  consumable?: boolean
  fridgeItem?: boolean
  ivOrInjection?: boolean
  requiresColdStorage?: boolean
  sizeOrType?: string
  minimumStock?: number
  reorderLevel?: number
  maximumStock?: number
  expiryAlertDays?: number
  dosageForm?: Option | null
}

interface ProductForm {
  department: 'PHARMACY'
  category: Option | null
  subcategory: Option | null
  genericName: Option | null
  brand: Option | null
  supplier: Option | null
  name: string
  description: string
  isConsumable: boolean
  variants: VariantForm[]
}

/* ================= COMPONENT ================= */
export default function EditProduct() {
  const defaultForm: ProductForm = {
    department: 'PHARMACY',
    category: null,
    subcategory: null,
    genericName: null,
    brand: null,
    supplier: null,
    name: '',
    description: '',
    isConsumable: true,
    variants: [{}],
  }

  const [form, setForm] = useState<ProductForm>(defaultForm)

  // Data from API
  const [categories, setCategories] = useState<Option[]>([])
  const [subcategories, setSubcategories] = useState<Record<number, Option[]>>(
    {}
  )
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [genericNames, setGenericNames] = useState<Option[]>([])
  const [brands, setBrands] = useState<Option[]>([])
  const [suppliers, setSuppliers] = useState<Option[]>([])
  const [strengthUnits, setStrengthUnits] = useState<Option[]>([])
  const [packingTypes, setPackingTypes] = useState<Option[]>([])
  const [dosageForms, setDosageForms] = useState<Option[]>([])
  const [ivOptions] = useState<Option[]>([
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
  ])
  const [booleanOptions] = useState<Option[]>([
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
  ])

  const API_BASE = import.meta.env.VITE_API_BASE_URL

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const token = localStorage.getItem('token')

    async function fetchData() {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }

        const [
          catRes,
          genRes,
          brandRes,
          supRes,
          strengthRes,
          packRes,
          dosageForm,
        ] = await Promise.all([
          fetch(`${API_BASE}/api/category`, { headers }),
          fetch(`${API_BASE}/api/generic-name`, { headers }),
          fetch(`${API_BASE}/api/brand`, { headers }),
          fetch(`${API_BASE}/api/supplier`, { headers }),
          fetch(`${API_BASE}/api/strength-unit`, { headers }),
          fetch(`${API_BASE}/api/packing-type`, { headers }),
          fetch(`${API_BASE}/api/dosage-form`, { headers }),
        ])

        const [
          catData,
          genData,
          brandData,
          supData,
          strengthData,
          packData,
          dosageData,
        ] = await Promise.all([
          catRes.json(),
          genRes.json(),
          brandRes.json(),
          supRes.json(),
          strengthRes.json(),
          packRes.json(),
          dosageForm.json(),
        ])

        if (catData.success) setCategories(catData.data)
        if (genData.success) setGenericNames(genData.data)
        if (brandData.success) setBrands(brandData.data)
        if (supData.success) setSuppliers(supData.data)
        if (strengthData.success) setStrengthUnits(strengthData.data)
        if (packData.success) setPackingTypes(packData.data)
        if (dosageData.success) setDosageForms(dosageData.data)

        /* Build subcategory map safely */
        if (catData.success) {
          const subMap: Record<number, Option[]> = {}

          catData.data.forEach((c: { id: number; children?: Option[] }) => {
            subMap[c.id] = c.children ?? []
          })

          setSubcategories(subMap)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [])

  /* ================= VARIANT HANDLERS ================= */
  const handleVariantChange = (
    index: number,
    field: keyof VariantForm,
    value: unknown
  ) => {
    const updated = [...form.variants]

    if (field === 'sku' && typeof value === 'string') {
      // 1. Trim leading/trailing spaces
      // 2. Replace multiple spaces with a single space
      // 3. Uppercase
      value = value.toUpperCase()
    }

    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, variants: updated })
  }

  const addVariant = () =>
    setForm({ ...form, variants: [...form.variants, {}] })
  const removeVariant = (index: number) =>
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) })

  const isMedicine = form.category?.name === 'Medicine'
  const token = localStorage.getItem('token')
  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        status: true,
        name: form.name,
        description: form.description,
        categoryId: form.category?.id,
        brandId: form.brand?.id,
        isBatchTracked: false,
        hasExpiry: isMedicine,
        isSerialized: false,
        requiresColdStorage: form.variants.some((v) => v.fridgeItem),
        isActive: true,
        variants: form.variants.map((v) => ({
          status: true,
          name: v.varientName,
          sku: v.sku,
          dosageFormId: v.dosageForm?.id,
          strengthUnitId: v.strengthUnit?.id,
          packingTypeId: v.packingType?.id,
          packQuantity: v.packQuantity,
          sizeOrType: v.sizeOrType,
          consumable: v.consumable ?? true,
          ivOrInjection: v.ivOrInjection,
          requiresColdStorage: v.fridgeItem ?? false,
          expiryAlertDays: v.expiryAlertDays ?? 90,
        })),
      }

      const res = await fetch(`${API_BASE}/api/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setSuccessMsg('Product added successfully!')
        setForm(defaultForm)
      } else {
        setErrorMsg(data.message || 'Failed to add product.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Error submitting product.')
    }
  }

  /* ================= RENDER ================= */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* ===== Classification ===== */}
      {successMsg && <SuccessMessage msg={successMsg} />}
      {errorMsg && <ErrorMessage msg={errorMsg} />}

      <div className="grid grid-cols-3 gap-4">
        <GroupInput>
          <Label>Department</Label>
          <Input value="PHARMACY" readOnly />
        </GroupInput>

        <GroupInput>
          <Label link={routePaths.ADD_CATEGORY}>Category</Label>
          <Dropdown
            options={categories}
            selected={form.category}
            onSelect={(opt) =>
              setForm({ ...form, category: opt, subcategory: null })
            }
            placeholder="Select Category"
          />
        </GroupInput>

        <GroupInput>
          <Label link={routePaths.ADD_SUB_CATEGORY}>Subcategory</Label>
          <Dropdown
            options={
              form.category ? subcategories[Number(form.category.id)] || [] : []
            }
            selected={form.subcategory}
            onSelect={(opt) => setForm({ ...form, subcategory: opt })}
            placeholder="Select Subcategory"
          />
        </GroupInput>
      </div>

      {/* ===== Product Info ===== */}
      <div className="grid grid-cols-3 gap-4">
        <GroupInput>
          <Label>Product Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </GroupInput>

        {isMedicine && (
          <GroupInput>
            <Label link={routePaths.ADD_GENERIC_NAME}>Generic Name</Label>
            <Dropdown
              options={genericNames}
              selected={form.genericName}
              onSelect={(opt) => setForm({ ...form, genericName: opt })}
              placeholder="Select Generic"
            />
          </GroupInput>
        )}

        <GroupInput>
          <Label link={routePaths.ADD_BRAND}>Brand</Label>
          <Dropdown
            options={brands}
            selected={form.brand}
            onSelect={(opt) => setForm({ ...form, brand: opt })}
            placeholder="Select Brand"
          />
        </GroupInput>

        <GroupInput>
          <Label link={routePaths.ADD_SUPPLIER}>Supplier</Label>
          <Dropdown
            options={suppliers}
            selected={form.supplier}
            onSelect={(opt) => setForm({ ...form, supplier: opt })}
            placeholder="Select Supplier"
          />
        </GroupInput>

        <GroupInput>
          <Label>Description</Label>
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </GroupInput>

        <GroupInput>
          <Label>Consumable</Label>
          <ToggleButton
            checked={form.isConsumable}
            onChange={() =>
              setForm({ ...form, isConsumable: !form.isConsumable })
            }
          />
        </GroupInput>
      </div>

      {/* ===== Variants ===== */}
      <div className="border-t pt-4">
        <p className="text-lg font-semibold mb-4">Variants</p>

        {form.variants.map((v, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-3 mb-6 border p-4 rounded"
          >
            <Input
              placeholder="Varient Name"
              value={v.varientName || ''}
              onChange={(e) => handleVariantChange(i, 'varientName', e.target.value)}
            />

            <Input
              placeholder="SKU"
              value={v.sku || ''}
              onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
            />

            <Input
              type="number"
              placeholder="Strength e.g. 500"
              value={v.strength ?? ''}
              onChange={(e) =>
                handleVariantChange(
                  i,
                  'strength',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <Dropdown
              options={dosageForms}
              selected={v.dosageForm || null}
              onSelect={(opt) => handleVariantChange(i, 'dosageForm', opt)}
              placeholder="Select Dosage Form"
            />

            <Dropdown
              options={strengthUnits}
              selected={v.strengthUnit || null}
              onSelect={(opt) => handleVariantChange(i, 'strengthUnit', opt)}
              placeholder="mg / ml / g"
            />

            {isMedicine && (
              <Dropdown
                options={ivOptions}
                selected={
                  v.ivOrInjection === undefined
                    ? null
                    : v.ivOrInjection
                      ? ivOptions[0]
                      : ivOptions[1]
                }
                onSelect={(opt) =>
                  handleVariantChange(i, 'ivOrInjection', opt.name === 'Yes')
                }
                placeholder="IV / Injection"
              />
            )}

            <Dropdown
              options={packingTypes}
              selected={v.packingType || null}
              onSelect={(opt) => handleVariantChange(i, 'packingType', opt)}
              placeholder="Packing Type"
            />

            {v.packingType?.name !== 'Piece' && (
              <Input
                type="number"
                placeholder="Qty in Box"
                value={v.packQuantity ?? ''}
                onChange={(e) =>
                  handleVariantChange(
                    i,
                    'packQuantity',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            )}

            <Input
              placeholder="Size / Type e.g. 10 x 10"
              value={v.sizeOrType ?? ''}
              onChange={(e) =>
                handleVariantChange(i, 'sizeOrType', e.target.value)
              }
            />

            <Dropdown
              options={booleanOptions}
              selected={
                v.fridgeItem === undefined
                  ? null
                  : v.fridgeItem
                    ? booleanOptions[0]
                    : booleanOptions[1]
              }
              onSelect={(opt) =>
                handleVariantChange(i, 'fridgeItem', opt.name === 'Yes')
              }
              placeholder="Fridge Item"
            />

            <Input
              type="number"
              placeholder="Minimum Stock"
              value={v.minimumStock ?? ''}
              onChange={(e) =>
                handleVariantChange(
                  i,
                  'minimumStock',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <Input
              type="number"
              placeholder="Reorder Level"
              value={v.reorderLevel ?? ''}
              onChange={(e) =>
                handleVariantChange(
                  i,
                  'reorderLevel',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <Input
              type="number"
              placeholder="Maximum Stock"
              value={v.maximumStock ?? ''}
              onChange={(e) =>
                handleVariantChange(
                  i,
                  'maximumStock',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <Input
              type="number"
              placeholder="Expiry Alert Days (e.g., 90)"
              value={v.expiryAlertDays} // default 90 days
              onChange={(e) =>
                handleVariantChange(
                  i,
                  'expiryAlertDays',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />

            <Button type="button" onClick={() => removeVariant(i)}>
              Remove
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addVariant}>
          + Add Variant
        </Button>
      </div>

      <Button className="w-fit mx-auto" type="submit">
        Add Product
      </Button>
    </form>
  )
}
