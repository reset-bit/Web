// 分页
function goPage(pno){//当前页
    let length = jQuery.sessionStorage.getItem("annLength");//JSON.parse(jQuery.sessionStorage.getItem("annLength"))
    // let length = 4;
    let pageSize = 3;//每页显示行数
    let totalPage = 0;//总页数
    if(length/pageSize > parseInt(length/pageSize)){
        totalPage = parseInt(length/pageSize) + 1;
    }
    else{
        totalPage = parseInt(length/pageSize);
    }

    let currentPage = pno;//当前页数
    let startRow = (currentPage - 1) * pageSize + 1;//开始行
    let endRow = currentPage * pageSize;//终止行
    endRow = (endRow > length)? length : endRow;
    console.log(endRow);
    //遍历控制数据显示，实现分页
    for(let i = 1; i < (length + 1); i++){
        let irow = jQuery("#announcement").children().eq(i);
        if(i >= startRow && i <= endRow){
            irow.style.display = "auto";
        }
        else{
            irow.style.display = "none";
        }
    }
    
    // var tempStr = "共"+num+"条记录   分"+totalPage+"页   当前第"+currentPage+"页";
    let tempStr = "";
    if(currentPage>1){
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"goPage("+(1)+")\">首页</a></li>";
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"goPage("+(currentPage-1)+")\">上一页</a></li>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" onClick=\"goPage("+(1)+")\">首页</button>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" onClick=\"goPage("+(currentPage-1)+")\">上一页</button>"
    }else{
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">首页</a></li>";
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">上一页</a></li>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" \">首页</button>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" \">上一页</button>"
    }
    if(currentPage<totalPage){
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"goPage("+(currentPage+1)+")\">下一页</a></li>";
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"goPage("+(totalPage)+")\">尾页</a></li>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" onClick=\"goPage("+(currentPage+1)+")\">下一页</button>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" onClick=\"goPage("+(totalPage)+")\">尾页</button>";
    }else{
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">下一页</a></li>";
        tempStr += "<li class=\"page-item\"><a class=\"page-link\" href=\"#\">尾页</a></li>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" \">下一页</button>";
        // tempStr += "<button class=/\"btn btn-primary\" type=\"button\" \">尾页</button>";
    }
    jQuery("#page").html(tempStr);
}