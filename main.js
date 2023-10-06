const content = document.querySelector(".content-card")
const categoriesConent = document.querySelector(".categories")
let count = 0
let total = 0
let cart= []
let totales=[]
let totalContent=document.querySelector("#total")
let countContent = document.querySelector(".count")
document.addEventListener("DOMContentLoaded",()=>{
    main()
})

function main(){
    getAllCategories()
    getAllProducts()
    totalContent.innerHTML = `$${total}`
    const cart = document.querySelector('.fa-cart-shopping')
    cart.addEventListener("click", ()=>{
        const listShopping=document.querySelector(".listShopping")
        listShopping.classList.toggle("inactive")
    })
    const home = document.querySelector("#home")
    home.addEventListener("click", getAllProducts)
    const showMobileCategories = document.querySelector('.fa-bars')
    countContent.innerHTML = count
    showMobileCategories.addEventListener("click", ()=> {
        categoriesConent.classList.toggle("inactive")
    })
}

const getAllProducts = async ()=>{
    try {
        const url="https://fakestoreapi.com/products"
        const respuesta= await fetch(url)
        const resultado= await respuesta.json()
        showProduct(resultado)

    } catch (error) {
        console.log(error);
    }
}

const getAllCategories = async ()=>{
    try {
        const url="https://fakestoreapi.com/products/categories"
        const respuesta= await fetch(url)
        const resultado= await respuesta.json()
        resultado.forEach ( category => {
            const categories = document.createElement("p")
            categories.innerText = category
            categories.addEventListener("click",()=> {
                getCategory(category)
            })
            categoriesConent.append(categories)
        });

    } catch (error) {
        console.log(error);
    }
}

const getCategory = async (category) => {
    try {
        const url=`https://fakestoreapi.com/products/category/${category}`
        const respuesta= await fetch(url)
        const resultado= await respuesta.json()
        showProduct(resultado)

    } catch (error) {
        console.log(error); 
    }
}

const showProduct = (products)=>{
    removeHTML(content)
    products.forEach(product => {
        const {id, title, image, price}= product
        const card = document.createElement("div")
        card.classList.add("card")
        const infoCard = document.createElement("div")
        infoCard.classList.add("infoCard")
        const imageProduct = document.createElement("img")
        imageProduct.src = image
        const titleProduct = document.createElement("h2")
        titleProduct.addEventListener("click",()=>{
            showModal(product)
        })
        titleProduct.innerText = title
        const priceProduct = document.createElement("p")
        priceProduct.innerText = `$${price}`
        const button = document.createElement("button")
        button.innerText="Add to cart"
        button.classList.add("btn")
        button.addEventListener("click",()=>{
            const inCartIndex = cart.findIndex(index=>index.id===id)
            if (inCartIndex !== -1){
                cart[inCartIndex].total+=price
                cart[inCartIndex].quantity+=1
            }
            else{
                cart.push({
                    id,
                    title,
                    image,
                    price,
                    total: price,
                    quantity: 1
                })
            }
            totales.push(price)
            let totalGeneral = totales.reduce((a,b) => a + b, 0)
            totalContent.innerHTML=`$${totalGeneral.toLocaleString("en")}`
            countContent.innerHTML=count+=1
            addCart(cart)
        } )
        infoCard.append(imageProduct, titleProduct, priceProduct)
        card.append(infoCard, button)
        content.append(card)
    })
}

const addCart = (cart) =>{
    const contentListShopping = document.querySelector(".content-listShopping")
    removeHTML(contentListShopping)
    cart.forEach(product =>{
        const contentProduct=document.createElement("div")
        const removeProduct=document.createElement("span")
        removeProduct.innerText="X"

        //ELIMINAR PRODUCTO EVENTO
        removeProduct.addEventListener("click", ()=>{
            deleteProduct(product)
        })

        contentProduct.classList.add("contentProductList")
        const img = document.createElement("img")
        img.src=product.image
        const title=document.createElement("h3")
        title.innerText=product.title
        const price=document.createElement("p")
        price.innerText=product.total
        contentProduct.append(img, title, price, removeProduct)
        contentListShopping.appendChild(contentProduct)

    })
}

const deleteProduct=(product)=>{
    countContent.innerHTML=count -= product.quantity
    const filterProduct = cart.filter(f =>f.id !== product.id)
    cart=[...filterProduct]

    const newTotalGeneral = filterProduct.reduce((a,b) =>a + b.total, 0)
    if (newTotalGeneral===0){
        totales=[]
    }
    totalContent.innerHTML = `$${newTotalGeneral.toLocaleString("en")}`
    addCart(cart)
}

const showModal = (product) =>{
    const modal = document.createElement("div")
    modal.classList.add("modal")
    modal.innerHTML = `
        <div class="moreInfo">
            <span class="closed">X</span>
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>${product.description}</p>
        </div>

    `
    setTimeout(()=>{
        const moreInfo = document.querySelector(".moreInfo")
        moreInfo.classList.add("animated")

    }, 100)

    modal.addEventListener("click", e=>{
        e.preventDefault()
        if(e.target.classList.contains("closed")){
            const moreInfo = document.querySelector(".moreInfo")
            moreInfo.classList.add("close")
            setTimeout(()=>{
                modal.remove()
            }, 500)
        }
    })
    document.querySelector(".content").appendChild(modal)
}
const removeHTML = (HTML) =>{
    while(HTML.firstChild){
        HTML.removeChild(HTML.firstChild)
    }
}