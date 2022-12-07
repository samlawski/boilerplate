const cookieBanner = (function(){
  const init = function(){
    showCookieBanner()
  }

  function readCookie(n) {
    let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`)
    return a ? a[1] : ''
  }

  function createBannerWrapper(){
    const element = document.createElement('div')
    element.setAttribute("id", "cookieBanner")
    element.style.cssText = `
      font-size: 0.6rem;
      background-color: #ddd;
      color: #444;
      width: 100%;
      text-align: center;
      padding: 10px;
      position: fixed;
      bottom: 0;
      left: 0;`
    
    return element
  }

  function createBannerSpacer(){
    const element = document.createElement('div')
    element.setAttribute("id", "cookieBannerSpacer")
    element.style.cssText = `
      height: 106px;
    `
    return element
  }

  function createBannerText(){
    const element = document.createElement('p')
    element.innerHTML = `
      In order to optimize our website for you we use cookies and analysis tools. By continuing to use the website, you consent to the use of cookies. For more information, please see our <a href="/privacy">Privacy Policy</a>.
      `
    return element
  }

  function createBannerLink(){
    const element = document.createElement('a')
    element.innerHTML = `Ok`
    element.style.cssText = `
      margin-top: 6px;
      padding: 4px;
      border: 1px solid #444;
      display: inline-block;
      cursor: pointer;`
    return element
  }

  function showCookieBanner(){
    if(!readCookie('cookieBannerDismissed')){
      const bannerWrapper = createBannerWrapper()
      const bannerSpacer = createBannerSpacer()
      const bannerText = createBannerText()
      const bannerLink = createBannerLink()

      bannerLink.addEventListener('click', function(){
        document.cookie = "cookieBannerDismissed=true"
        bannerWrapper.style.display = "none"
        bannerSpacer.style.display = "none"
      })
      
      bannerWrapper.appendChild(bannerText)
      bannerWrapper.appendChild(bannerLink)

      document.body.appendChild(bannerWrapper)
      document.body.appendChild(bannerSpacer)
    }
  }

  return {
    init: init
  }
})()

cookieBanner.init()