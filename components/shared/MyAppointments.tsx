"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Calendar, Clock, Home, Check, X, Trash2, Building } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

interface Appointment {
  _id: string
  property: {
    _id: string
    title: string
    images: string[]
  }
  company?: {
    _id: string
    realEstateName: string
  }
  scheduledDate: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const MyAppointments = () => {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/appointment/me`,
          { withCredentials: true }
        )
        setAppointments(response.data.data.appointments || [])
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to fetch your appointments',
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchAppointments()
    }
  }, [session])

  const handleDeleteAppointment = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/appointment/${id}`,
        { withCredentials: true }
      )

      setAppointments(prev => prev.filter(appt => appt._id !== id))
      
      toast.success('Appointment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete appointment')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Group appointments by status
  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed')
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Pending Appointments */}
      {pendingAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            Pending Appointments ({pendingAppointments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pendingAppointments.map(appointment => (
              <Card key={appointment._id} className="border-amber-200">
                <CardHeader>
                    <div className="flex flex-col justify-center gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                        <Home className="w-6 h-6 text-sky-500" />
                        <h3 className='text-normal'>{appointment.property.title}</h3>
                        </CardTitle>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <Building className="w-6 h-6 text-sky-500" />
                        <span className='text-sm'>With {appointment.company.realEstateName}</span>
                    </div>
                   <div className="flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-sky-500" />
                        <span className='text-sm'>{formatDate(appointment.scheduledDate)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                <Badge variant="secondary">Pending</Badge>
                  <Button
                    className='cursor-pointer'
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAppointment(appointment._id)}
                    disabled={deletingId === appointment._id}
                  >
                    {deletingId === appointment._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Cancel Request
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Appointments */}
      {confirmedAppointments.length > 0 && (
        <>
          {pendingAppointments.length > 0 && <Separator />}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Confirmed Appointments ({confirmedAppointments.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {confirmedAppointments.map(appointment => (
                <Card key={appointment._id} className="border-green-200">
                   <CardHeader>
                    <div className="flex flex-col justify-center gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                        <Home className="w-6 h-6 text-sky-500" />
                        <h3 className='text-normal'>{appointment.property.title}</h3>
                        </CardTitle>
                    </div>
                    </div>
                   </CardHeader>
                   <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Building className="w-6 h-6 text-sky-500" />
                                <span className='text-sm'>With {appointment.company.realEstateName}</span>
                            </div>
                        <div className="flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-sky-500" />
                                <span className='text-sm'>{formatDate(appointment.scheduledDate)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                    <Button
                        className='cursor-pointer'
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        disabled={deletingId === appointment._id}
                    >
                        {deletingId === appointment._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Cancel Appointment
                    </Button>
                    </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cancelled Appointments */}
      {cancelledAppointments.length > 0 && (
        <>
          {(pendingAppointments.length > 0 || confirmedAppointments.length > 0) && <Separator />}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <X className="w-6 h-6 text-red-500" />
              Cancelled Appointments ({cancelledAppointments.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cancelledAppointments.map(appointment => (
                <Card key={appointment._id} className="border-red-200">
                   <CardHeader>
                    <div className="flex flex-col justify-center gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                        <Home className="w-6 h-6 text-sky-500" />
                        <h3 className='text-normal'>{appointment.property.title}</h3>
                        </CardTitle>
                    </div>
                    </div>
                   </CardHeader>
                   <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Building className="w-6 h-6 text-sky-500" />
                                <span className='text-sm'>With {appointment.company.realEstateName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-sky-500" />
                                    <span className='text-sm'>{formatDate(appointment.scheduledDate)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                    <Badge variant="destructive">Cancelled</Badge>
                    <Button
                        className='cursor-pointer'
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        disabled={deletingId === appointment._id}
                    >
                        {deletingId === appointment._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete Record
                    </Button>
                    </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {appointments.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Calendar className="w-12 h-12 text-gray-400" />
          <h3 className="text-xl font-medium">No appointments found</h3>
          <p className="text-gray-500">You haven't scheduled any property tours yet</p>
        </div>
      )}
    </div>
  )
}

export default MyAppointments