"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Calendar, Clock, User, Home, Check, X, AlarmClockPlus, CalendarCheck2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

interface Appointment {
  _id: string
  property: {
    _id: string
    title: string
  }
  customer: {
    _id: string
    name: string
    email: string
  }
  scheduledDate: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const RealestateAppointments = () => {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/appointment`,
          { withCredentials: true }
        )
        console.log("Appointments: ", response)
        setAppointments(response.data.data.appointments || [])
      } catch (error) {
       
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchAppointments()
    }
  }, [session])

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    if (status === 'confirmed') {
      setAcceptingId(id)
    } else {
      setRejectingId(id)
    }
    
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/appointment/${id}`,
        { status },
        { withCredentials: true }
      )
  
      setAppointments(prev =>
        prev.map(appt =>
          appt._id === id ? { ...appt, status } : appt
        )
      )
  
      toast.success(`Appointment ${status === 'confirmed' ? 'confirmed' : 'cancelled'}`)
    } catch (error) {
      toast.error('Failed to update appointment')
    } finally {
      if (status === 'confirmed') {
        setAcceptingId(null)
      } else {
        setRejectingId(null)
      }
    }
  }

  // Group appointments by status
  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed')
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled')

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
      <div className="space-y-4">
        <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          New Appointments ({pendingAppointments.length})
        </h2>
        {pendingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <Badge variant="secondary">Pending</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <AlarmClockPlus className="w-6 h-6 text-sky-500" />
                            <span className='text-sm'>Requested on {formatDate(appointment.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-sky-500" />
                            <span className='text-sm'>{appointment.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-sky-500" />
                            <span className='text-sm'>For {formatDate(appointment.scheduledDate)}</span>
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                        <Button
                            className='bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 hover:text-red-800'
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                            disabled={acceptingId === appointment._id || rejectingId === appointment._id}
                        >
                            {rejectingId === appointment._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                            <X className="w-4 h-4 mr-1" />
                            )}
                            Reject
                        </Button>
                        <Button
                            className='bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 hover:text-green-800'
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment._id, 'confirmed')}
                            disabled={acceptingId === appointment._id || rejectingId === appointment._id}
                        >
                            {acceptingId === appointment._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                            <Check className="w-4 h-4 mr-1" />
                            )}
                            Accept
                        </Button>
                    </CardFooter>
                </Card>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No pending appointments</div>
        )}
      </div>

      <Separator />

      {/* Confirmed Appointments */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
          <Check className="w-6 h-6 text-green-500" />
          Confirmed Appointments ({confirmedAppointments.length})
        </h2>
        {confirmedAppointments.length > 0 ? (
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
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 justify-between items-start">
                    <div className="flex items-center gap-2">
                        <CalendarCheck2 className="w-6 h-6 text-sky-500" />
                        <span className='text-sm'>Confirmed on {formatDate(appointment.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-6 h-6 text-sky-500" />
                      <span className='text-sm'>{appointment.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-sky-500" />
                      <span className='text-sm'>For {formatDate(appointment.scheduledDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No confirmed appointments</div>
        )}
      </div>

      <Separator />

      {/* Cancelled Appointments */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-2xl font-bold flex items-center gap-2">
          <X className="w-6 h-6 text-red-500" />
          Cancelled Appointments ({cancelledAppointments.length})
        </h2>
        {cancelledAppointments.length > 0 ? (
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
                    <Badge variant="destructive">Cancelled</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 justify-between items-start">
                    <div className="flex items-center gap-2">
                      <User className="w-6 h-6 text-sky-500" />
                      <span className='text-sm'>{appointment.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-sky-500" />
                      <span className='text-sm'>For {formatDate(appointment.scheduledDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No cancelled appointments</div>
        )}
      </div>
    </div>
  )
}

export default RealestateAppointments