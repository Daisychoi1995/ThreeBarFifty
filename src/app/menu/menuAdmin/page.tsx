'use client'
import UploadImage from "@/components/UploadImage"
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
const menuAdmin = () => {
  const [user] = useAuthState(auth);
  console.log('user',user)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter()
  const handleUploadComplete = async (url: string): Promise<void> => {
    setImageUrl(url); // Store image URL
  };

  const handleAddMenuItem = async () => {
    if (!name || !description || !price || !imageUrl) {
      return alert("All fields are required!");
    }

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, description, price, imageUrl}),
      })
      if (res.ok) {
        alert("Menu item added successfully!")
        router.push('/menu')
        
    } }catch (error) {
      console.error("Error adding menu item", error);
    }
  };

  return (user && 
    <div className="p-4">
      <h2 className="text-xl font-bold">Add New Menu Item</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 block w-full my-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 block w-full my-2"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 block w-full my-2"
      />
      
      <UploadImage onUpload={handleUploadComplete} />

      {imageUrl && <p className="text-green-600">Image uploaded successfully!</p>}

      <button onClick={handleAddMenuItem} className="cursor-pointer border-2 border-[#009B64] bg-[#009B64] text-white py-3 px-6 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-[#009B64] hover:border-[#007a48] transform hover:scale-105">
        Add Item
      </button>
    </div>
  )
}
export default menuAdmin