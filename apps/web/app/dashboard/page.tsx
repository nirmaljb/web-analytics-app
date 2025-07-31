"use client";
import { useEffect, useState } from "react";

interface Data {
    id: number,
    type: string
    name: string
    createdAt: string
}

export default function Page() {
    const [data, setData] = useState<Data[]>([]);
    useEffect(() => {
        const getData = async() => {
            const response = await fetch('/api/analytics');
            const analytics = await response.json();
            setData(analytics);
        }
        getData();
    }, [])

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>TYPE</th>
                    <th>NAME</th>
                    <th>CREATED_AT</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{row.id}</td>
                        <td>{row.type}</td>
                        <td>{row.name}</td>
                        <td>{new Date(row.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}