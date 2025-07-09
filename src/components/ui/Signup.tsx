import React from 'react'

const handleSignup = () => {

}

const Signup = () => {
  return (
    <form onSubmit={handleSignup}>
        <label htmlFor="email">Email:</label> <br/>
        <input type="text" id="email" name="email"></input> <br/>
        <label htmlFor="password">Password:</label> <br/>
        <input type="password" id="password" name="password"></input> <br/>
    </form>
  )
}

export default Signup