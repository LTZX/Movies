
function detailview(classes, data){
    console.log('called')
    drawpan(classes, data)
    drawbubble(data['overall']['polarity'],data['overall']['subjectivity'])
    drawcloud(data['overall']['top'])
}
