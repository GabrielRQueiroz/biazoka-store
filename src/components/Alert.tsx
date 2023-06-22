import React from 'react'
import clsx from 'clsx';

interface IAlertProps {
   alertType: "success" | "error" | "warning" | "info"
}

const alertStyle = {
   success: "alert-success",
   error: "alert-error",
   warning: "alert-warning",
   info: "alert-info"
}

export const Alert = ({alertType}: IAlertProps) => {
  return (
      <div className={clsx("alert", alertStyle[alertType])}>
         {alertType}
      </div>
  )
}
