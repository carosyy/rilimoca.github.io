//Para crear una Nav Activo en todas las paginas


document.querySelectorAll('.activeNav').forEach(
    link => {
        if(link.href === window.location.href){
            link.setAttribute('aria-current','main')
        }
    }
)