import MyAppointments from "@/components/shared/MyAppointments"

const MyAppointmentsPage = () => {
    return (
      <div className="container py-8 mt-18">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all your property tour appointments
          </p>
        </div>
        <MyAppointments />
      </div>
    )
  }
  
  export default MyAppointmentsPage