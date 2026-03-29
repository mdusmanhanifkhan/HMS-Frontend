import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { routePaths } from '../../../constants/routePaths'
import Loading from '../../../components/loading/Loading'

/* ================= TYPES ================= */

type Category = {
  id: number
  name: string
}

type Brand = {
  id: number
  name: string
}

type ProductVariant = {
  id: number
  name: string
  sku?: string
  purchasePrice?: number
  salePrice?: number
}

type ProductItem = {
  id: number
  name: string
  sku?: string
  barcode?: string
  description?: string | null
  isActive: boolean
  category?: Category | null
  brand?: Brand | null
  variants: ProductVariant[]
}

/* ================= COMPONENT ================= */

const Products = () => {
  const [allProducts, setAllProducts] = useState<ProductItem[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string
  const token = localStorage.getItem('token')

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE}/api/product`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        if (!res.ok) {
          const errJson: { message?: string } = await res.json()
          throw new Error(errJson.message || 'Failed to fetch products')
        }

        const json: { data?: ProductItem[] } = await res.json()
        setAllProducts(json.data ?? [])
        setProducts(json.data ?? [])
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return

        setError(err instanceof Error ? err.message : 'Something went wrong')
        setAllProducts([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    return () => controller.abort()
  }, [API_BASE, token])

  /* ================= FRONTEND SEARCH ================= */

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      setProducts(allProducts)
      return
    }

    const filtered = allProducts.filter(
      (prod) =>
        prod.name.toLowerCase().includes(term) ||
        prod.sku?.toLowerCase().includes(term) ||
        prod.barcode?.toLowerCase().includes(term) ||
        prod.category?.name?.toLowerCase().includes(term) ||
        prod.brand?.name?.toLowerCase().includes(term) ||
        prod.variants.some((v) => v.name.toLowerCase().includes(term))
    )

    setProducts(filtered)
  }, [searchTerm, allProducts])

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-10 relative">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Product Management</p>

        <div className="flex items-center gap-5 min-w-100">
          {/* Search */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#000" strokeWidth="2" transform="translate(-1687 -1941)">
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>

            <Input
              type="text"
              placeholder="Search product..."
              variant="none"
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_PRODUCT}>
            + Add Product
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Barcode</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>

            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={8} className="text-center text-red-500 py-4">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  No products found
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              products.map((prod) => (
                <tr key={prod.id} className="bg-[#DFDEDE] border-b transition-colors">
                  <td className="px-6 py-3 font-medium">{prod.id}</td>
                  <td className="px-6 py-3 font-semibold">{prod.variants.length > 0
            ? prod.variants.map((v) => v.sku ?? '-').join(', ')
            : '-'}</td>
                  <td className="px-6 py-3">{prod.barcode ?? '-'}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {prod.category?.name ?? '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3">{prod.brand?.name ?? '-'}</td>
                 
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          prod.isActive ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        } block`}
                      />
                      {prod.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                                    <td className="px-6 py-3"><Button>Edit</Button></td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products