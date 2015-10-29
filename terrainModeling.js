//-------------------------------------------------------------------------
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray)
{
    var heightArray= [];
    for(var i = 0; i < (n+1)*(n+1); i++)
        heightArray.push(0);
    //console.log(heightArray);
    generateHeightMap(1, n+1, 0, n, 0, n, heightArray);
    
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(heightArray[j*(n+1)+i]);
           var normal = computeVertexNormals(n, minX+deltaX*j, minY+deltaY*i, deltaX, deltaY, heightArray, i, j);
           
           normalArray.push(vec3.dot(normal, [1.0, 0.0, 0.0]));
           normalArray.push(vec3.dot(normal, [1.0, 1.0, 0.0]));
           normalArray.push(vec3.dot(normal, [0.0, 0.0, 1.0]));
           //normalArray.push(0);
           //normalArray.push(0);
           //normalArray.push(1);
       }

    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2;
       }
    return numT;
}
//-------------------------------------------------------------------------
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}

//-------------------------------------------------------------------------

function generateHeightMap(n, size, minX, maxX, minY, maxY, heightArray)
{
    var randrange = 1;
    var randcenter = 0;
    //console.log(heightArray);
    if(minX+1 == maxX)
        return;
    var midX = (minX + maxX)/2;
    var midY = (minY + maxY)/2;
    //diamond step
    heightArray[midY*size+midX] = ((heightArray[minY*size+minX]+
                                    heightArray[minY*size+maxX]+
                                    heightArray[maxY*size+minX]+
                                    heightArray[maxY*size+maxX])/4)+
                                    (Math.random()*randrange-randcenter)/n;
    //square step
    if(minY == 0)   //top 
        heightArray[midX] = (heightArray[minX]+ 
                             heightArray[maxX]+
                             heightArray[midY*size+midX])/3 + 
                             (Math.random()*randrange-randcenter)/n;
    else            //top
    {
        heightArray[minY*size+midX] = (heightArray[(minY-(midY-minY))*size+midX]+
                                      heightArray[minY*size+minX]+
                                      heightArray[minY*size+maxX]+
                                      heightArray[midY*size+midX])/4+
                                      (Math.random()*randrange-randcenter)/n;
    }
    if(maxY == size-1)   //bottom
        heightArray[maxY*size+midX] = (heightArray[maxY*size+minX]+ 
                                       heightArray[maxY*size+maxX]+
                                       heightArray[midY*size+midX])/3 + 
                                       (Math.random()*randrange-randcenter)/n;
    else            //bottom
    {
        heightArray[maxY*size+midX] = (heightArray[(maxY+(maxY-midY))*size+midX]+
                                      heightArray[maxY*size+minX]+
                                      heightArray[maxY*size+maxX]+
                                      heightArray[maxY*size+midX])/4+
                                     (Math.random()*randrange-randcenter)/n;
    }
    if(minX == 0)   //left
        heightArray[midY*size] = (heightArray[minY*size]+
                                  heightArray[midY*size+midX]+
                                  heightArray[maxY*size])/3+
                                  (Math.random()*randrange-randcenter)/n;
    else            //left
    {
        heightArray[midY*size+minX] = (heightArray[minY*size+minX]+
                                       heightArray[midY*size+(minX-(midX-minX))]+
                                       heightArray[midY*size+midX]+
                                       heightArray[maxY*size+minX])/4+
                                       (Math.random()*randrange-randcenter)/n;
    }
    if(maxX == size-1)   //right
        heightArray[midY*size] = (heightArray[minY*size+maxX]+
                                  heightArray[midY*size+midX]+
                                  heightArray[maxY*size+maxX]/3)+
                                  (Math.random()*randrange-randcenter)/n;
    else            //right
    {
        heightArray[midY*size+minX] = (heightArray[minY*size+maxX]+                     
                                       heightArray[midY*size+midX]+
                                       heightArray[midY*size+(maxX+(maxX-midX))]+
                                       heightArray[maxY*size+maxX])/4+
                                       (Math.random()*randrange-randcenter)/n;
    }
    generateHeightMap(n+1, size, minX, midX, minY, midY, heightArray);   //topleft
    generateHeightMap(n+1, size, midX, maxX, minY, midY, heightArray);   //topright
    generateHeightMap(n+1, size, minX, midX, midY, maxY, heightArray);   //bottomleft
    generateHeightMap(n+1, size, midX, maxX, midY, maxY, heightArray);   //bottomright
    
}

function computeVertexNormals(size, x, y, deltax, deltay, heightArray, i, j)          
{
    var normalsum = vec3.create();
    var normal = vec3.create();        
    
    if(i != 0 && j != 0)
    {
    var p0 = vec3.fromValues(x-deltax, y, heightArray[j*size+(i-1)]);            //1    
    var p1 = vec3.fromValues(x, y, heightArray[j*size+i]);       
    var p2 = vec3.fromValues(x-deltax, y-deltay, heightArray[(j-1)*size+(i-1)]);   
    normal = normalFromVertices(p0, p1, p2);    
    vec3.add(normalsum, normalsum, normal);
    
    p0 = vec3.fromValues(x-deltax, y-deltay, heightArray[(j-1)*size+(i-1)]);     //2
    p1 = vec3.fromValues(x, y, heightArray[j*size+i]);
    p2 = vec3.fromValues(x-deltax, y, heightArray[j*size+(i-1)]);       
    normal = normalFromVertices(p0, p1, p2);  
    vec3.add(normalsum, normalsum, normal);         
    }
    
    if(i != size-1 && j != 0)
    {
    p0 = vec3.fromValues(x, y, heightArray[j*size+i]);                           //3
    p1 = vec3.fromValues(x+deltax, y, heightArray[j*size+(i+1)]);
    p2 = vec3.fromValues(x, y-deltay, heightArray[(j-1)*size+i]);       
    normal = normalFromVertices(p0, p1, p2);  
    vec3.add(normalsum, normalsum, normal);  
    }
    
    if(i != 0 && j != size-1)
    {
    p0 = vec3.fromValues(x-deltax, y, heightArray[j*size+(i-1)]);                //4
    p1 = vec3.fromValues(x, y+deltay, heightArray[(j+1)*size+i]);
    p2 = vec3.fromValues(x, y, heightArray[j*size+i]);       
    normal = normalFromVertices(p0, p1, p2);  
    vec3.add(normalsum, normalsum, normal);  
    }
    
    if(i != size-1 && j != size-1)
    {
    p0 = vec3.fromValues(x, y, heightArray[j*size+i]);                           //5
    p1 = vec3.fromValues(x, y+deltay, heightArray[(j+1)*size+i]);                
    p2 = vec3.fromValues(x+deltax, y+deltay, heightArray[(j+1)*size+(i-1)]);   
    normal = normalFromVertices(p0, p1, p2);  
    vec3.add(normalsum, normalsum, normal);  
    
    p0 = vec3.fromValues(x, y, heightArray[j*size+i]);                           //6
    p2 = vec3.fromValues(x+deltax, y+deltay, heightArray[(j+1)*size+(i-1)]);   
    p1 = vec3.fromValues(x+deltax, y, heightArray[j*size+i]);   
    normal = normalFromVertices(p0, p1, p2);  
    vec3.add(normalsum, normalsum, normal);  
    }

    vec3.normalize(normalsum, normalsum);
    
    return normalsum;
}

function normalFromVertices(p0, p1, p2) //counterclockwise vertex naming
{
    
    var p2p0 = vec3.create();
    var p1p0 = vec3.create();
    var normal = vec3.create();
    vec3.subtract(p2p0, p2, p0);
    vec3.subtract(p1p0, p1, p0);
    vec3.cross(normal, p2p0, p1p0);
    vec3.normalize(normal, normal);
    
    return normal;    
}








/*

    
    
     -----------------------------------
    | -               | -               |
    |   -         2   |   -             |
    |     -           |     -           |
    |       -         |       -         |
    |         -       |         -       |
    |   1       -     |   3       -     |
    |             -   |             -   |
     -----------------------------------
    | -               | -               |
    |   -             |   -      6      |
    |     -     4     |     -           |
    |       -         |       -         |
    |         -       |   5     -       |
    |           -     |           -     |
    |             -   |             -   |
     ------------------------------------



*/

















