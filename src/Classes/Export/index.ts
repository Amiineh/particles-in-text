import { Particle } from '../Shapes/Particle'
import { ColorState } from '../states/ColorState/index'
import { BGDrawer } from '../states/types'

export interface IExportStrategy {
  export: (
    particles: Particle[],
    bgDrawer: BGDrawer,
    colorMode: ColorState,
    canvas: HTMLCanvasElement
  ) => void
}

export class JPEGExportStrategy implements IExportStrategy{
    export = (
        particles: Particle[], 
        bgDrawer: BGDrawer,
        colorMode: ColorState,
        canvas: HTMLCanvasElement,
    ) => {
        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = canvas.width
        exportCanvas.height = canvas.height
        const ctx = exportCanvas.getContext('2d') as CanvasRenderingContext2D
        

        // Export the canvas as an image with a specific DPI
        const dpi = prompt('Enter DPI?')
        if(!dpi || isNaN(parseInt(dpi))){
            return
        }
        const scaleFactor = parseInt(dpi) / 96 // 96 DPI is the standard screen DPI
        exportCanvas.width = exportCanvas.width * scaleFactor
        exportCanvas.height = exportCanvas.height * scaleFactor
        ctx.scale(scaleFactor, scaleFactor)
        bgDrawer.getNew(ctx, exportCanvas).drawBG()
        for(let i = 0; i < particles.length; i++){
            const particle = particles[i]
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = colorMode.getColor(particle)
            ctx.arc(
                (particle.pos.x + particle.deformityX),
                (particle.pos.y + particle.deformityY),
                particle.radius, 
                0, 
                Math.PI * 2
            )
            ctx.fill()
            ctx.restore()
        }

        const imageDataUrl = exportCanvas.toDataURL('image/jpeg')
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = 'canvas_image.jpeg'
        link.click()
    }
}

export class PNGExportStrategy implements IExportStrategy{
    export = (
        particles: Particle[], 
        _: BGDrawer,
        colorMode: ColorState,
        canvas: HTMLCanvasElement,
    ) => {
        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = canvas.width
        exportCanvas.height = canvas.height
        const ctx = exportCanvas.getContext('2d') as CanvasRenderingContext2D
      

        // Export the canvas as an image with a specific DPI
        const dpi = prompt('Enter DPI?')
        if(!dpi || isNaN(parseInt(dpi))){
            return
        }
        const scaleFactor = parseInt(dpi) / 96 // 96 DPI is the standard screen DPI
        exportCanvas.width = exportCanvas.width * scaleFactor
        exportCanvas.height = exportCanvas.height * scaleFactor
        ctx.scale(scaleFactor, scaleFactor)
        for(let i = 0; i < particles.length; i++){
            const particle = particles[i]
            ctx.save()
            ctx.beginPath()
            ctx.fillStyle = colorMode.getColor(particle)
            ctx.arc(
                (particle.pos.x + particle.deformityX),
                (particle.pos.y + particle.deformityY),
                particle.radius, 
                0, 
                Math.PI * 2
            )
            ctx.fill()
            ctx.restore()
        }

        const imageDataUrl = exportCanvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = imageDataUrl
        link.download = 'canvas_image.png'
        link.click()
    }
}

export class SVGExportStrategy implements IExportStrategy {
    export = (
        particles: Particle[], 
        _: BGDrawer,
        colorMode: ColorState,
        canvas: HTMLCanvasElement,
    ) => {
        const xmlns = 'http://www.w3.org/2000/svg'
        const boxWidth = canvas.width
        const boxHeight = canvas.height
        const svgElem = document.createElementNS(xmlns, 'svg')
        svgElem.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight)
        svgElem.setAttributeNS(null, 'width', `${boxWidth}`)
        svgElem.setAttributeNS(null, 'height', `${boxHeight}`)
        for (let i = 0; i< particles.length; i++){
            const particle = particles[i]
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            circle.setAttribute('cx', `${particle.pos.x + particle.deformityX}`)  // x-coordinate of the center
            circle.setAttribute('cy', `${particle.pos.y + particle.deformityY}`)  // y-coordinate of the center
            circle.setAttribute('r', `${particle.radius}`)    // radius
            circle.setAttribute('fill', `${colorMode.getColor(particle)}`) // fill color
            svgElem.append(circle)
        }
        // Get the SVG content as a string
        const svgContent = new XMLSerializer().serializeToString(svgElem)
        // Create a Blob containing the SVG content
        const blob = new Blob([svgContent], { type: 'image/svg+xml' })
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob)
        // Create a link element for downloading
        const a = document.createElement('a')
        a.href = url
        a.download = 'my_svg_file.svg' // Set the filename here
        // Trigger a click event on the link to start the download
        a.click()
        // Clean up by revoking the URL
        URL.revokeObjectURL(url)
    }
}