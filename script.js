$(document).ready(function () {
  // 漢堡選單
  $('.navbar-collapse-btn').click(function () {
    $('.navbar-collapse').toggleClass('active');
    $('.navbar-collapse-icon').toggleClass('d-none');
  });
  // 篩選功能 頁面切換
  $('.tools-type-btn').click(function (e){
    e.preventDefault();
    $(this).toggleClass('active');
    $(this).parent().siblings().find('.tools-type-btn').removeClass('active');
  }) 
  // 篩選功能 下拉選單
  // 種類
  $('.dropdown-filter-btn').click(function(e){
    e.preventDefault();
    $('.dropdown-filter-menu').toggleClass('d-none');
  });
  // 新舊
  $('.dropdown-order-btn').click(function(e){
    e.preventDefault();
    $('.dropdown-order-menu').toggleClass('d-none');
  });
  $('.new-to-old').click(function(e){
    e.preventDefault();
    $('.dropdown-order-menu').toggleClass('d-none');
    $('.dropdown-order-btnText').text('由新到舊');
  });
  $('.old-to-new').click(function(e){
    e.preventDefault();
    $('.dropdown-order-menu').toggleClass('d-none');
    $('.dropdown-order-btnText').text('由舊到新');
  });

  // 手風琴
  $('.qa-list-link').click(function(e){
    e.preventDefault();
    $(this).find('.material-icons').toggleClass('d-none');
    $(this).find('h5,span').toggleClass('text-primary');
    $(this).parent().find('p').slideToggle('fast').toggleClass('d-none');
   
  });

  // back to top
  $('.back-to-top').click(function(e){
    e.preventDefault();
    $('html,body').animate({scrollTop:0},800);
  });
});

// Swiper
var swiper = new Swiper(".mySwiper", {
  breakpoints: {
    992: {
      slidesPerView: 3
    },
    768: {
      slidesPerView: 2
    },
    375: {
      slidesPerView: 1
    }
  },
  spaceBetween: 24,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
});
let apiPath = "https://2023-engineer-camp.zeabur.app";
let cardList = document.querySelector('#ai-card');
let pagiantion = document.querySelector('.pagination');
// 設定空物件，後面輸出ai_works.pag/data用，因為page顯示的內容是用{}/[]包起來的
let workPage = {};
let workData = [];
//預設queryString參數,後面執行函式時帶入用
let data = {
  type: '',
  sort: 0,
  page: 1,
  search: ''
}
//建立函式，並帶入參數
function getData({ type, sort, page, search }) {
  let apiUrl = `${apiPath}/api/v1/works?${type ? `type=${type}&` : ''}&sort=${sort}&page=${page}&${search ? search = `${search}&` : ''}`;

  axios.get(apiUrl)
    .then(function (response) {
      console.log(response);
      workData = response.data.ai_works.data;
      workPage = response.data.ai_works.page;
      renderWorks();
      renderPages();
    });

}
getData(data);


//  渲染畫面
function renderWorks() {
  let works = '';
  // works的內容就是卡片的html元素    
  workData.forEach((item) => {
    works += `<li class="card-3 tools-card">
        <div class="tools-card-img-frame">
          <img src="${item.imageUrl}"
            alt="ai-tool" class="tools-card-img-content">
        </div>
        <div class="card-body mb-auto">
          <h3 class="h6 fw-black mb-sm">${item.title}</h3>
          <p class="fs-sm text-black-80">${item.description}</p>
        </div>
        <div class="card-detail">
          <p class="fw-bold">AI 模型</p>
          <span>${item.model}</span>
        </div>
        <div class="card-detail">
          <p>#${item.type}</p>
          <a href="${item.link}" class="card-detail-btn" target="_blank"><span class="material-icons">share</span></a>
        </div>
      </li>`

  });
  // 將指定的cardList的元素加上 html 
  cardList.innerHTML = works;
}


// 切換作品 新舊排序 - 預設的html要保留因為只是加入文字跟icon而已
// 指定位置- 按鈕-新到舊 舊到新
let desc = document.querySelector('#desc');
let asc = document.querySelector('#asc');
let btnOrder = document.querySelector('#btnOrder');
// 新到舊 sort = 0
desc.addEventListener('click', function (e) {
  e.preventDefault(e);
  // data的參數是0
  data.sort = 0;
  getData(data);
  // 按鈕顯示為 由新到舊
  btnOrder.innerHTML = `<span class="dropdown-order-btnText">由新到舊</span>
    <span class="material-icons fs-base vertical-middle ml-sm">
      expand_more
    </span>`;
}
  , false);

// 舊到新 sort = 1
asc.addEventListener('click', function (e) {
  e.preventDefault();
  // data的參數是1
  data.sort = 1;
  getData(data);
  // 按鈕顯示為 由舊到新
  btnOrder.innerHTML = `<span class="dropdown-order-btnText">由舊到新</span>
    <span class="material-icons fs-base vertical-middle ml-sm">
      expand_more
    </span>`;
}
  , false);


//切換作品類型
// 指定位置 - 所有選項按鈕
let btnType = document.querySelectorAll('.btn-type');
// 針對每個btn-type執行以下動作
btnType.forEach((item) => {
  // 當該按鈕點擊時觸發監聽
  item.addEventListener('click', () => {
    // 如果按鈕裡面的文字是'全部'，則data.type維持預設空值，否則data.type的值為按鈕的文字
    if (item.textContent === '全部') {
      data.type = '';
    } else {
      data.type = item.textContent;
    };
    getData(data);
  }, false);
});


//搜尋
let search = document.querySelector('#search');
search.addEventListener('keydown', function (e) {
  // 如果按了鍵盤的enter鍵
  if (e.keyCode === 13) {
    // data.search的內容等於鍵盤輸入的值
    data.search = search.value;
    // 顯示一頁
    data.page = 1;
    getData(data);
    // 測試
    console.log('成功');
  } else {
    // 測試
    console.log('搜尋不到資料');
  }
}, false);


//切換分頁
// 參數workPage是一開始有定義過的值
function changePage(workPage) {
  let pageLinks = document.querySelectorAll('.page-link')
  let pageId = '';
  //網頁裡的每個 pageLinks 都要執行
  pageLinks.forEach(function (item) {
    //當該pageLinks被點擊時觸發監聽
    item.addEventListener('click', (e) => {
      e.preventDefault();
      //抓取 a連結的 data-page
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      //如果不等於pageId的話，data.page數字+1
      if (!pageId) {
        data.page = Number(workPage.current_page) + 1
      }
      getData(data);
    }, false)
  });
};
//渲染到畫面
function renderPages() {
  let pageStr = '';
  for (let i = 1; i <= workPage.total_pages; i += 1) {
    pageStr += `<li class="pagination-item ${workPage.current_page == i ? "active" : ""} mr-xs"><a class="page-link ${workPage.current_page == i ? "disabled" : ""}" href="#" data-page="${i}">${i}</a>`
  };

  if (workPage.has_next) {
    pageStr += `<li class="pagination-item"><a class="page-link" href="#"><span class="material-icons pagination-item-icon">
    chevron_right</span></a></li>`
  };

  pagiantion.innerHTML = pageStr;
  changePage(workPage);
}