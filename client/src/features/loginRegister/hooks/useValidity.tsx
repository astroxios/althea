import { useEffect, useState } from 'react'

const useValidity = () => {
  const [ emailValidity, setEmailValidity ] = useState(false)

  useEffect(() => {
    if (emailValidity) {
      console.log('Email is valid')
    }
  }, [emailValidity])

  const validateEmail = (email: string) => {
    // Start with one or more alphanumeric characters, dots (.), percent signs (%), plus signs (+), or hyphens (-).
    // Followed by the at symbol (@).
    // Followed by one or more alphanumeric characters, dots (.), or hyphens (-).
    // Followed by a dot (.).
    // End with two or more alphabetic characters.
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailValidity(re.test(email));
  }

  return {
    emailValidity,
    validateEmail,
  }
}

export default useValidity