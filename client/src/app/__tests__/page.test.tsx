import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Page />)
    const nextLogo = screen.getByAltText('Next.js logo')
    expect(nextLogo).toBeInTheDocument()
  })

  it('renders the "Get started by editing" text', () => {
    render(<Page />)
    // Using a regular expression to find the text, making it case-insensitive
    // and allowing for potential surrounding whitespace or slight variations.
    const mainText = screen.getByText(/Get started by editing/i)
    expect(mainText).toBeInTheDocument()
  })
})
