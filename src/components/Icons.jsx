import React from 'react';
import { motion } from "framer-motion"

const Icons = ({ icon, showTooltips, setShowTooltips, velocidades, indiceVel, setIndiceVel, vol, setVol }) => {

    const hoverStar = () => { // Los Object.keys a priori no son necesarios, pero sirven para evitar bugs menores
        Object.keys(showTooltips).forEach(key => showTooltips[key] = false);
        setShowTooltips({ ...showTooltips, [icon.type]: true })
    }

    const hoverEnd = () => {
        Object.keys(showTooltips).forEach(key => showTooltips[key] = false);
        setShowTooltips({ ...showTooltips })
    }

    return (
        <motion.div onClick={ icon.onClick } className='relative cursor-pointer select-none' onHoverStart={ hoverStar } onHoverEnd={ hoverEnd }>
            <img onClick={icon.onClickImg} className={icon.type} src={`/img/${icon.img}`} />
            
            { showTooltips[`${icon.type}`] && (
                <motion.div className={`fixed p-1 ${icon.className_}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    {
                    icon.type === "volumen" ? 
                    <div className='border-2 bg-black text-white p-1 rounded-sm'>
                        <p>Volumen {Math.round(vol*100)}</p>
                        <input onInput={ (e) => setVol(e.target.value/100) } onKeyDown={(e) => e.preventDefault()} type="range" min={0} max={100} step={1} value={Math.round(vol*100)}/>
                    </div> :

                    icon.type === "velocidad" ? 

                    <div className='border-2 bg-black text-white p-1 rounded-sm'>
                        <p>Velocidad x{velocidades[indiceVel]}</p>
                        <input onInput={ (e) => setIndiceVel(velocidades.indexOf(parseFloat(e.target.value))) } type="range" min={velocidades[0]} max={velocidades.at(-1)} step={velocidades[1] - velocidades[0]} value={velocidades[indiceVel]}/>
                    </div> :

                    <p className="border-2 bg-black text-white p-1 rounded-sm">{icon.texto}</p>
                    }
                </motion.div>
                )
            }
        </motion.div>
    );
}

export default Icons;
