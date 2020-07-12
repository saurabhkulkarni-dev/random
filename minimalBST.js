class TreeNode {
     constructor(value) {
         this.value = value;
         this.left = null;
         this.right = null;
     }

     insertIntoBST(array) {
         return this._addMinBST(array, 0, array.length - 1);
     }

     _createMinBST(array, start, end) {
         if(end < start) {
             return null;
         }
         let mid = Math.floor((start + end)/2);
         let node = new TreeNode(mid);
         node.left = this._createMinBST(array, start, mid - 1);
         node.right = this._createMinBST(array, mid + 1, end);
         return node;
     }
}