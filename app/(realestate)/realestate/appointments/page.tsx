import RealestateAppointments from "@/components/realestate/RealestateAppointments"

const RealestateAppointmentPage = () => {
  return (
    <div className="container py-3">
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-3xl font-bold">Appointment Management</h1>
        <p className="text-muted-foreground text-sm">
          View and manage all property tour appointments
        </p>
      </div>
      <RealestateAppointments />
    </div>
  )
}

export default RealestateAppointmentPage