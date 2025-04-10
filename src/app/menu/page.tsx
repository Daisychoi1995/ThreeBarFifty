'use client'

import { auth } from '@/lib/firebase/config'
import type { MenuItem } from '@/models/Model'
import useCart from '@/stores/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const Menu = () => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const countItems = menuItems.length
  const fetchMenuItems = async () => {
    const res = await fetch('/api/menu')
    const data = await res.json()
    return data
  }
  useEffect(() => {
    fetchMenuItems()
      .then((data) => setMenuItems(data))
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      const data = await fetchMenuItems()
      setMenuItems(data)
    } catch (error) {
      console.error('Error adding menu item', error)
    }
  }

  const handleClick = (id: string) => {
    if (!id) {
      console.error('Item ID is missing')
      return
    }
    try {
      router.push(`/menu/${id}`)
    } catch (error) {
      console.error('Error loading menu item', error)
    }
  }

  const addItemToCart = useCart((state) => state.addItemToCart)

  return (
    <div className="p-4 ">
      <p className="text-[20px] text-[#009B64] font-bold">
        {countItems} products
      </p>
      <p className="flex text-[20px] text-red-500 font-bold cursor-pointer justify-center">
        {user && <Link href="/menu/menuAdmin">Upload Menu</Link>}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {menuItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-lg">
            <div className="relative w-full h-[300px]">
              <Image
                src={item.url}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => handleClick(item.id)}
              />
            </div>
            <h2
              className="text-lg font-semibold mt-2 cursor-pointer"
              onClick={() => handleClick(item.id)}
            >
              {item.name}
            </h2>
            <p className="text-[#009B64] font-bold mt-1 ">${item.price}</p>
            <div className="flex place-content-between">
              <button
                onClick={() =>
                  addItemToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.url,
                    quantity: 1,
                  })
                }
                className="cursor-pointer border-2 border-[#009B64] bg-[#009B64] text-white py-3 px-6 rounded-full font-semibold text-[15px] transition-all duration-300 ease-in-out hover:bg-white hover:text-[#009B64] hover:border-[#007a48] transform hover:scale-105"
              >
                ADD TO CART
              </button>

              {user && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[20px] text-red-500 font-bold cursor-pointer"
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
