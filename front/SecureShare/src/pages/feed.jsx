import { useEffect, useState } from 'react'
import ImageCard from '../components/imageCard'


const API_URL = 'http://localhost:3000/api/v1/upload/get'

export default function Feed() {

    const [images, setImages] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')

            const res = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setImages(data)
        }
        fetchData()
    }, [])

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1>Le Feed de </h1>
            {images.map((img) => (
                <ImageCard
                    key={img._id}
                    title={img.title}
                    description={img.description}
                    image={img.image}
                />  
            ))}
        </div>
    )
}