function connectAudioNodes(...nodes){
  nodes.forEach((node, currentIndex, nodes)=>{
    if(currentIndex != nodes.length - 1){
      node.connect(nodes[currentIndex + 1])
    }
    else{
      console.log('on the last index')
    }
  })
}

class DummyNode{
  constructor(name){
    this.name = name;
    this.beenAltered = false;
  }


  connect(node){
    console.log('connecting to node: ', node.name);
    this.beenAltered = true;
  }
}


let node1 = new DummyNode('stream');
let node2 = new DummyNode('analyzer');
let node3 = new DummyNode('ac');

connectAudioNodes(node1,node2,node3);
console.log(node1.beenAltered, node2.beenAltered,node3.beenAltered)