import { motion } from "framer-motion"

interface ArrayIconosProps {
    type: string,
    img: string,
    className_: string,
    texto?: string,
    onClick?: () => void,
    onClickImg?: () => void
}

interface ShowTooltipsProps {
    [ket: string]: boolean
}

interface IconsProps {
    icon: ArrayIconosProps,
    showTooltips: ShowTooltipsProps
    setShowTooltips: React.Dispatch<React.SetStateAction<ShowTooltipsProps>>,
    velocidades: number[],
    indiceVel: number,
    setIndiceVel: React.Dispatch<React.SetStateAction<number>>,
    vol: number,
    setVol: React.Dispatch<React.SetStateAction<number>>
}

const Icons = ({ icon, showTooltips, setShowTooltips, velocidades, indiceVel, setIndiceVel, vol, setVol }: IconsProps) => {

    const hoverStar = () => {
        Object.keys(showTooltips).forEach(key => showTooltips[key] = false);
        setShowTooltips({ ...showTooltips, [icon.type]: true })
    }

    const hoverEnd = () => {
        Object.keys(showTooltips).forEach(key => showTooltips[key] = false);
        setShowTooltips({ ...showTooltips })
    }

    const onInputVol = (e: React.FormEvent<HTMLInputElement>) => {
        const formTarget = e.target
        if (formTarget instanceof HTMLInputElement) {
            setVol(parseFloat(formTarget.value) / 100);
        }
    }


    const onInputVel = (e: React.FormEvent<HTMLInputElement>) => {
        const formTarget = e.target;
        if (formTarget instanceof HTMLInputElement) {
            setIndiceVel(velocidades.indexOf(parseFloat(formTarget.value)))
        }
    }

    const renderTooltipContent = (icon: ArrayIconosProps) => {
        if (icon.type === "volumen") {
            return (
                <div className='border-2 bg-black text-white p-1 rounded-sm'>
                    <p>Volumen {Math.round(vol * 100)}</p>
                    <input aria-label="Volume control" onInput={onInputVol} onKeyDown={(e) => e.preventDefault()} type="range" min={0} max={100} step={1} value={Math.round(vol * 100)} />
                </div>
            );
        } else if (icon.type === "velocidad") {
            return (
                <div className='border-2 bg-black text-white p-1 rounded-sm'>
                    <p>Velocidad x{velocidades[indiceVel]}</p>
                    <input aria-label="Speed control" onInput={onInputVel} type="range" min={velocidades[0]} max={velocidades.at(-1)} step={velocidades[1] - velocidades[0]} value={velocidades[indiceVel]} />
                </div>
            );
        } else {
            return <p className="border-2 bg-black text-white p-1 rounded-sm">{icon.texto}</p>;
        }
    };

    return (
        <motion.div onClick={ icon.onClick } className='relative cursor-pointer select-none' onHoverStart={ hoverStar } onHoverEnd={ hoverEnd }>
            <img title='' onClick={icon.onClickImg} className={icon.type} src={`/img/${icon.img}`} />

            { showTooltips[icon.type] && (
                <motion.div className={`fixed p-1 ${icon.className_}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    {renderTooltipContent(icon)}
                </motion.div>
                )
            }
        </motion.div>
    );
}

export default Icons;
