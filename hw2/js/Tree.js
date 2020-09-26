/** Class representing a Tree. */
//python -m SimpleHTTPServer 8080
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        this.animallist = json.map(input => {
            return new Node(input.name, input.parent)
        })
        console.log(this.animallist);

        for (let animalNode of this.animallist) {
            let parentNode = this.animallist.find(node => node.name === animalNode.parentName)
            if (parentNode) {
                animalNode.parentNode = parentNode;
                parentNode.addChild(animalNode);
            }
        }
        console.log(this.animallist);
        // console.log('the parent of ' + animalNode.name + ' is ' + parentNode.name);//.addChild(animalNode);
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        // use recursion - tree traversal, depth first search and breadth first search


        let animalNode = this.animallist.find(node => node.name === 'Animal')
        this.assignLevel(animalNode, 0)
        this.assignPosition(animalNode, 0)
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level
            // function something() {}
            // tree => new Tree() { something() {} }
            // this.something => tree
            // something()
            //this.assignLevel => function
            //this.assignLevel() => invoking the function
            // this.assignLevel(someNode, someLevel)
        for (let childNode of node.children) {
            this.assignLevel(childNode, level + 1)
        }
        // this.assignlevel("Animal",0)
        // this.assignLevel(node)
        // console.log(node, level)
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        node.position = position

        /**
         * Recursive function to traverse the tree and find the child with the largest position
         */
        function findLastPosition(node) {
            let lastChild = node.children[node.children.length - 1]
            if (lastChild === undefined) {
                return node.position
            } else {
                return findLastPosition(lastChild, true)
            }
        }

        for (let childIndex in node.children) {
            let childNode = node.children[childIndex]
                // console.log(node.children[childIndex])
                // console.log(childIndex)
            if (childIndex == 0) {
                this.assignPosition(childNode, position)

            } else {
                this.assignPosition(childNode, findLastPosition(node.children[childIndex - 1]) + 1)
            }
        }

    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        let body = d3.select("body")

        let svg = body.append("svg")
            .attr("height", 1200) //defining the "canvas" in which to draw the diagram
            .attr("width", 1200)

        let children = this.animallist.filter(node => node.parentNode) //start with children because there will always be one single parent node to draw to 
        svg.selectAll("line")
            .data(children) //where to find the data
            .enter()
            .append("line")
            .attr("x1", childNode => (childNode.parentNode.level * 145) + 145)
            .attr("y1", childNode => (childNode.parentNode.position * 145) + 145)
            .attr("x2", childNode => (childNode.level * 145) + 145)
            .attr("y2", childNode => (childNode.position * 145) + 145)

        let selection = svg.selectAll("g")
            .data(this.animallist)
            .enter()
            .append("g")
            .attr("class", "nodeGroup")
            .attr("transform", d => `translate (${(d.level *145) +145}, ${(d.position *145) + 145})`)
            //translate uses the x and y coordinates and moves them along as "g", d = data (animallist)

        selection.append("circle")
            .attr("r", 35)

        selection.append("text")
            .attr("class", "label")
            .html(d => d.name)

    }

}