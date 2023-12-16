import PersonalContextProvider from './components/PersonalContext'
import ContenedorVideo from './components/ContenedorVideo'
import ContenedorLista from './components/ContenedorLista'

function App() {
    return (
        <PersonalContextProvider>
            <main className='p-2 flex justify-between h-screen gap-3 max-md:flex-col max-md:h-auto'>
                <ContenedorVideo />
                <ContenedorLista />
            </main>
            <a className='fixed top-[1vw] left-[1vw] hover:font-semibold text-sm max-md:text-xs hover:scale-105 hover:translate-x-[0.25vw] transition-all duration-100' href="https://www.linkedin.com/in/alejandro-portaluppi/" target="_blank">Desarrollado por Alejandro P</a>
        </PersonalContextProvider>
    )
}

export default App
