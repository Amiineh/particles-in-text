// "moore" JavaScript module by hughsk@GitHub, released under the MIT license
// (https://github.com/hughsk/moore)
function moore(range, dimensions) {
    range = range || 1
    dimensions = dimensions || 2

    var size = range * 2 + 1
    var length = Math.pow(size, dimensions) - 1
    var neighbors = new Array(length)

    for (var i = 0; i < length; i++) {
        var neighbor = neighbors[i] = new Array(dimensions)
        var index = i < length / 2 ? i : i + 1
        for (var dimension = 1; dimension <= dimensions; dimension++) {
            var value = index % Math.pow(size, dimension)
            neighbor[dimension - 1] = value / Math.pow(size, dimension - 1) - range
            index -= value
        }
    }

    return neighbors
}

// Code below: "poisson-disk-sampling" JavaScript module by Kevin Chapelier 
// (kchapelier@GitHub), released under the MIT license
// Combined into a single file (modification: change colliding names) 
// (https://github.com/kchapelier/poisson-disk-sampling)

/**
 * PoissonDiskSampling constructor
 * @param {object} options Options
 * @param {Array} options.shape Shape of the space
 * @param {float} options.minDistance Minimum distance between each points
 * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function|null} [options.distanceFunction] Function to control the distance between each point depending on their position, must return a value between 0 and 1
 * @param {function|null} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0
 * @param {function|null} [rng] RNG function, defaults to Math.random
 * @constructor
 */
function PoissonDiskSampling(options, rng) {
    this.shape = options.shape;

    if (typeof options.distanceFunction === 'function') {
        this.implementation = new VariableDensityPDS(options, rng);
    } else {
        this.implementation = new FixedDensityPDS(options, rng);
    }
}

PoissonDiskSampling.prototype.implementation = null;

/**
 * Add a totally random point in the grid
 * @returns {Array} The point added to the grid
 */
PoissonDiskSampling.prototype.addRandomPoint = function () {
    return this.implementation.addRandomPoint();
};

/**
 * Add a given point to the grid
 * @param {Array} point Point
 * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
 */
PoissonDiskSampling.prototype.addPoint = function (point) {
    return this.implementation.addPoint(point);
};

/**
 * Try to generate a new point in the grid, returns null if it wasn't possible
 * @returns {Array|null} The added point or null
 */
PoissonDiskSampling.prototype.next = function () {
    return this.implementation.next();
};

/**
 * Automatically fill the grid, adding a random point to start the process if needed.
 * Will block the thread, probably best to use it in a web worker or child process.
 * @returns {Array[]} Sample points
 */
PoissonDiskSampling.prototype.fill = function () {
    return this.implementation.fill();
};

/**
 * Get all the points in the grid.
 * @returns {Array[]} Sample points
 */
PoissonDiskSampling.prototype.getAllPoints = function () {
    return this.implementation.getAllPoints();
};

/**
 * Get all the points in the grid along with the result of the distance function.
 * @throws Will throw an error if a distance function was not provided to the constructor.
 * @returns {Array[]} Sample points with their distance function result
 */
PoissonDiskSampling.prototype.getAllPointsWithDistance = function () {
    return this.implementation.getAllPointsWithDistance();
};

/**
 * Reinitialize the grid as well as the internal state
 */
PoissonDiskSampling.prototype.reset = function () {
    this.implementation.reset();
};

function tinyNDArrayOfInteger(gridShape) {
    var dimensions = gridShape.length,
        totalLength = 1,
        stride = new Array(dimensions),
        dimension;

    for (dimension = dimensions; dimension > 0; dimension--) {
        stride[dimension - 1] = totalLength;
        totalLength = totalLength * gridShape[dimension - 1];
    }

    return {
        stride: stride,
        data: new Uint32Array(totalLength)
    };
}

function tinyNDArrayOfArray(gridShape) {
    var dimensions = gridShape.length,
        totalLength = 1,
        stride = new Array(dimensions),
        data = [],
        dimension, index;

    for (dimension = dimensions; dimension > 0; dimension--) {
        stride[dimension - 1] = totalLength;
        totalLength = totalLength * gridShape[dimension - 1];
    }

    for (index = 0; index < totalLength; index++) {
        data.push([]);
    }

    return {
        stride: stride,
        data: data
    };
}

// sphere-random module by Mikola Lysenko under the MIT License
// waiting for https://github.com/scijs/sphere-random/pull/1 to be merged

/**
 * @param {int} d Dimensions
 * @param {Function} rng
 * @returns {Array}
 */
function sampleSphere(d, rng) {
    var v = new Array(d),
        d2 = Math.floor(d / 2) << 1,
        r2 = 0.0,
        rr,
        r,
        theta,
        h,
        i;

    for (i = 0; i < d2; i += 2) {
        rr = -2.0 * Math.log(rng());
        r = Math.sqrt(rr);
        theta = 2.0 * Math.PI * rng();

        r2 += rr;
        v[i] = r * Math.cos(theta);
        v[i + 1] = r * Math.sin(theta);
    }

    if (d % 2) {
        var x = Math.sqrt(-2.0 * Math.log(rng())) * Math.cos(2.0 * Math.PI * rng());
        v[d - 1] = x;
        r2 += Math.pow(x, 2);
    }

    h = 1.0 / Math.sqrt(r2);

    for (i = 0; i < d; ++i) {
        v[i] *= h;
    }

    return v;
}

/**
 * Get the neighbourhood ordered by distance, including the origin point
 * @param {int} dimensionNumber Number of dimensions
 * @returns {Array} Neighbourhood
 */
function getNeighbourhood(dimensionNumber) {
    var neighbourhood = moore(2, dimensionNumber),
        origin = [],
        dimension;

    // filter out neighbours who are too far from the center cell
    // the impact of this, performance wise, is surprisingly small, even in 3d and higher dimensions
    neighbourhood = neighbourhood.filter(function (n) {
        var dist = 0;

        for (var d = 0; d < dimensionNumber; d++) {
            dist += Math.pow(Math.max(0, Math.abs(n[d]) - 1), 2);
        }

        return dist < dimensionNumber; // cellSize = Math.sqrt(this.dimension)
    });

    for (dimension = 0; dimension < dimensionNumber; dimension++) {
        origin.push(0);
    }

    neighbourhood.push(origin);

    // sort by ascending distance to optimize proximity checks
    // see point 5.1 in Parallel Poisson Disk Sampling by Li-Yi Wei, 2008
    // http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.460.3061&rank=1
    neighbourhood.sort(function (n1, n2) {
        var squareDist1 = 0,
            squareDist2 = 0,
            dimension;

        for (dimension = 0; dimension < dimensionNumber; dimension++) {
            squareDist1 += Math.pow(n1[dimension], 2);
            squareDist2 += Math.pow(n2[dimension], 2);
        }

        if (squareDist1 < squareDist2) {
            return -1;
        } else if (squareDist1 > squareDist2) {
            return 1;
        } else {
            return 0;
        }
    });

    return neighbourhood;
}

var neighbourhoodCache = {};

/**
 * Get the neighbourhood ordered by distance, including the origin point
 * @param {int} dimensionNumber Number of dimensions
 * @returns {Array} Neighbourhood
 */
function getNeighbourhoodMemoized(dimensionNumber) {
    if (!neighbourhoodCache[dimensionNumber]) {
        neighbourhoodCache[dimensionNumber] = getNeighbourhood(dimensionNumber);
    }

    return neighbourhoodCache[dimensionNumber];
}

/**
 * Get the squared euclidean distance from two points of arbitrary, but equal, dimensions
 * @param {Array} point1
 * @param {Array} point2
 * @returns {number} Squared euclidean distance
 */
function squaredEuclideanDistance(point1, point2) {
    var result = 0,
        i = 0;

    for (; i < point1.length; i++) {
        result += Math.pow(point1[i] - point2[i], 2);
    }

    return result;
}

const epsilon = 2e-14;

/**
 * FixedDensityPDS constructor
 * @param {object} options Options
 * @param {Array} options.shape Shape of the space
 * @param {float} options.minDistance Minimum distance between each points
 * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function|null} [rng] RNG function, defaults to Math.random
 * @constructor
 */
function FixedDensityPDS(options, rng) {
    if (typeof options.distanceFunction === 'function') {
        throw new Error('PoissonDiskSampling: Tried to instantiate the fixed density implementation with a distanceFunction');
    }

    this.shape = options.shape;
    this.minDistance = options.minDistance;
    this.maxDistance = options.maxDistance || options.minDistance * 2;
    this.maxTries = Math.ceil(Math.max(1, options.tries || 30));

    this.rng = rng || Math.random;

    this.dimension = this.shape.length;
    this.squaredMinDistance = this.minDistance * this.minDistance;
    this.minDistancePlusEpsilon = this.minDistance + epsilon;
    this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon);
    this.cellSize = this.minDistance / Math.sqrt(this.dimension);

    this.neighbourhood = getNeighbourhoodMemoized(this.dimension);

    this.currentPoint = null;
    this.processList = [];
    this.samplePoints = [];

    // cache grid

    this.gridShape = [];

    for (var i = 0; i < this.dimension; i++) {
        this.gridShape.push(Math.ceil(this.shape[i] / this.cellSize));
    }

    this.grid = tinyNDArrayOfInteger(this.gridShape); //will store references to samplePoints
}

FixedDensityPDS.prototype.shape = null;
FixedDensityPDS.prototype.dimension = null;
FixedDensityPDS.prototype.minDistance = null;
FixedDensityPDS.prototype.maxDistance = null;
FixedDensityPDS.prototype.minDistancePlusEpsilon = null;
FixedDensityPDS.prototype.squaredMinDistance = null;
FixedDensityPDS.prototype.deltaDistance = null;
FixedDensityPDS.prototype.cellSize = null;
FixedDensityPDS.prototype.maxTries = null;
FixedDensityPDS.prototype.rng = null;
FixedDensityPDS.prototype.neighbourhood = null;

FixedDensityPDS.prototype.currentPoint = null;
FixedDensityPDS.prototype.processList = null;
FixedDensityPDS.prototype.samplePoints = null;
FixedDensityPDS.prototype.gridShape = null;
FixedDensityPDS.prototype.grid = null;

/**
 * Add a totally random point in the grid
 * @returns {Array} The point added to the grid
 */
FixedDensityPDS.prototype.addRandomPoint = function () {
    var point = new Array(this.dimension);

    for (var i = 0; i < this.dimension; i++) {
        point[i] = this.rng() * this.shape[i];
    }

    return this.directAddPoint(point);
};

/**
 * Add a given point to the grid
 * @param {Array} point Point
 * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
 */
FixedDensityPDS.prototype.addPoint = function (point) {
    var dimension,
        valid = true;

    if (point.length === this.dimension) {
        for (dimension = 0; dimension < this.dimension && valid; dimension++) {
            valid = (point[dimension] >= 0 && point[dimension] <= this.shape[dimension]);
        }
    } else {
        valid = false;
    }

    return valid ? this.directAddPoint(point) : null;
};

/**
 * Add a given point to the grid, without any check
 * @param {Array} point Point
 * @returns {Array} The point added to the grid
 * @protected
 */
FixedDensityPDS.prototype.directAddPoint = function (point) {
    var internalArrayIndex = 0,
        stride = this.grid.stride,
        dimension;

    this.processList.push(point);
    this.samplePoints.push(point);

    for (dimension = 0; dimension < this.dimension; dimension++) {
        internalArrayIndex += ((point[dimension] / this.cellSize) | 0) * stride[dimension];
    }

    this.grid.data[internalArrayIndex] = this.samplePoints.length; // store the point reference

    return point;
};

/**
 * Check whether a given point is in the neighbourhood of existing points
 * @param {Array} point Point
 * @returns {boolean} Whether the point is in the neighbourhood of another point
 * @protected
 */
FixedDensityPDS.prototype.inNeighbourhood = function (point) {
    var dimensionNumber = this.dimension,
        stride = this.grid.stride,
        neighbourIndex,
        internalArrayIndex,
        dimension,
        currentDimensionValue,
        existingPoint;

    for (neighbourIndex = 0; neighbourIndex < this.neighbourhood.length; neighbourIndex++) {
        internalArrayIndex = 0;

        for (dimension = 0; dimension < dimensionNumber; dimension++) {
            currentDimensionValue = ((point[dimension] / this.cellSize) | 0) + this.neighbourhood[neighbourIndex][dimension];

            if (currentDimensionValue < 0 || currentDimensionValue >= this.gridShape[dimension]) {
                internalArrayIndex = -1;
                break;
            }

            internalArrayIndex += currentDimensionValue * stride[dimension];
        }

        if (internalArrayIndex !== -1 && this.grid.data[internalArrayIndex] !== 0) {
            existingPoint = this.samplePoints[this.grid.data[internalArrayIndex] - 1];

            if (squaredEuclideanDistance(point, existingPoint) < this.squaredMinDistance) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Try to generate a new point in the grid, returns null if it wasn't possible
 * @returns {Array|null} The added point or null
 */
FixedDensityPDS.prototype.next = function () {
    var tries,
        angle,
        distance,
        currentPoint,
        newPoint,
        inShape,
        i;

    while (this.processList.length > 0) {
        if (this.currentPoint === null) {
            this.currentPoint = this.processList.shift();
        }

        currentPoint = this.currentPoint;

        for (tries = 0; tries < this.maxTries; tries++) {
            inShape = true;
            distance = this.minDistancePlusEpsilon + this.deltaDistance * this.rng();

            if (this.dimension === 2) {
                angle = this.rng() * Math.PI * 2;
                newPoint = [
                    Math.cos(angle),
                    Math.sin(angle)
                ];
            } else {
                newPoint = sampleSphere(this.dimension, this.rng);
            }

            for (i = 0; inShape && i < this.dimension; i++) {
                newPoint[i] = currentPoint[i] + newPoint[i] * distance;
                inShape = (newPoint[i] >= 0 && newPoint[i] < this.shape[i])
            }

            if (inShape && !this.inNeighbourhood(newPoint)) {
                return this.directAddPoint(newPoint);
            }
        }

        if (tries === this.maxTries) {
            this.currentPoint = null;
        }
    }

    return null;
};

/**
 * Automatically fill the grid, adding a random point to start the process if needed.
 * Will block the thread, probably best to use it in a web worker or child process.
 * @returns {Array[]} Sample points
 */
FixedDensityPDS.prototype.fill = function () {
    if (this.samplePoints.length === 0) {
        this.addRandomPoint();
    }

    while (this.next()) {}

    return this.samplePoints;
};

/**
 * Get all the points in the grid.
 * @returns {Array[]} Sample points
 */
FixedDensityPDS.prototype.getAllPoints = function () {
    return this.samplePoints;
};

/**
 * Get all the points in the grid along with the result of the distance function.
 * @throws Will always throw an error.
 */
FixedDensityPDS.prototype.getAllPointsWithDistance = function () {
    throw new Error('PoissonDiskSampling: getAllPointsWithDistance() is not available in fixed-density implementation');
};

/**
 * Reinitialize the grid as well as the internal state
 */
FixedDensityPDS.prototype.reset = function () {
    var gridData = this.grid.data,
        i = 0;

    // reset the cache grid
    for (i = 0; i < gridData.length; i++) {
        gridData[i] = 0;
    }

    // new array for the samplePoints as it is passed by reference to the outside
    this.samplePoints = [];

    // reset the internal state
    this.currentPoint = null;
    this.processList.length = 0;
};

/**
 * Get the euclidean distance from two points of arbitrary, but equal, dimensions
 * @param {Array} point1
 * @param {Array} point2
 * @returns {number} Euclidean distance
 */
function euclideanDistance(point1, point2) {
    var result = 0,
        i = 0;

    for (; i < point1.length; i++) {
        result += Math.pow(point1[i] - point2[i], 2);
    }

    return Math.sqrt(result);
}

/**
 * VariableDensityPDS constructor
 * @param {object} options Options
 * @param {Array} options.shape Shape of the space
 * @param {float} options.minDistance Minimum distance between each points
 * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function} options.distanceFunction Function to control the distance between each point depending on their position, must return a value between 0 and 1
 * @param {float} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0
 * @param {function|null} rng RNG function, defaults to Math.random
 * @constructor
 */
function VariableDensityPDS(options, rng) {
    if (typeof options.distanceFunction !== 'function') {
        throw new Error('PoissonDiskSampling: Tried to instantiate the variable density implementation without a distanceFunction');
    }

    this.shape = options.shape;
    this.minDistance = options.minDistance;
    this.maxDistance = options.maxDistance || options.minDistance * 2;
    this.maxTries = Math.ceil(Math.max(1, options.tries || 30));
    this.distanceFunction = options.distanceFunction;
    this.bias = Math.max(0, Math.min(1, options.bias || 0));

    this.rng = rng || Math.random;

    this.dimension = this.shape.length;
    this.minDistancePlusEpsilon = this.minDistance + epsilon;
    this.deltaDistance = Math.max(0, this.maxDistance - this.minDistancePlusEpsilon);
    this.cellSize = this.maxDistance / Math.sqrt(this.dimension);

    this.neighbourhood = getNeighbourhoodMemoized(this.dimension);

    this.currentPoint = null;
    this.currentDistance = 0;
    this.processList = [];
    this.samplePoints = [];
    this.sampleDistance = []; // used to store the distance for a given point

    // cache grid

    this.gridShape = [];

    for (var i = 0; i < this.dimension; i++) {
        this.gridShape.push(Math.ceil(this.shape[i] / this.cellSize));
    }

    this.grid = tinyNDArrayOfArray(this.gridShape); //will store references to samplePoints and sampleDistance
}

VariableDensityPDS.prototype.shape = null;
VariableDensityPDS.prototype.dimension = null;
VariableDensityPDS.prototype.minDistance = null;
VariableDensityPDS.prototype.maxDistance = null;
VariableDensityPDS.prototype.minDistancePlusEpsilon = null;
VariableDensityPDS.prototype.deltaDistance = null;
VariableDensityPDS.prototype.cellSize = null;
VariableDensityPDS.prototype.maxTries = null;
VariableDensityPDS.prototype.distanceFunction = null;
VariableDensityPDS.prototype.bias = null;
VariableDensityPDS.prototype.rng = null;
VariableDensityPDS.prototype.neighbourhood = null;

VariableDensityPDS.prototype.currentPoint = null;
VariableDensityPDS.prototype.currentDistance = null;
VariableDensityPDS.prototype.processList = null;
VariableDensityPDS.prototype.samplePoints = null;
VariableDensityPDS.prototype.sampleDistance = null;
VariableDensityPDS.prototype.gridShape = null;
VariableDensityPDS.prototype.grid = null;

/**
 * Add a totally random point in the grid
 * @returns {Array} The point added to the grid
 */
VariableDensityPDS.prototype.addRandomPoint = function () {
    var point = new Array(this.dimension);

    for (var i = 0; i < this.dimension; i++) {
        point[i] = this.rng() * this.shape[i];
    }

    return this.directAddPoint(point);
};

/**
 * Add a given point to the grid
 * @param {Array} point Point
 * @returns {Array|null} The point added to the grid, null if the point is out of the bound or not of the correct dimension
 */
VariableDensityPDS.prototype.addPoint = function (point) {
    var dimension,
        valid = true;

    if (point.length === this.dimension) {
        for (dimension = 0; dimension < this.dimension && valid; dimension++) {
            valid = (point[dimension] >= 0 && point[dimension] <= this.shape[dimension]);
        }
    } else {
        valid = false;
    }

    return valid ? this.directAddPoint(point) : null;
};

/**
 * Add a given point to the grid, without any check
 * @param {Array} point Point
 * @returns {Array} The point added to the grid
 * @protected
 */
VariableDensityPDS.prototype.directAddPoint = function (point) {
    var internalArrayIndex = 0,
        stride = this.grid.stride,
        pointIndex = this.samplePoints.length,
        dimension;

    this.processList.push(pointIndex);
    this.samplePoints.push(point);
    this.sampleDistance.push(this.distanceFunction(point));

    for (dimension = 0; dimension < this.dimension; dimension++) {
        internalArrayIndex += ((point[dimension] / this.cellSize) | 0) * stride[dimension];
    }

    this.grid.data[internalArrayIndex].push(pointIndex); // store the point reference

    return point;
};

/**
 * Check whether a given point is in the neighbourhood of existing points
 * @param {Array} point Point
 * @returns {boolean} Whether the point is in the neighbourhood of another point
 * @protected
 */
VariableDensityPDS.prototype.inNeighbourhood = function (point) {
    var dimensionNumber = this.dimension,
        stride = this.grid.stride,
        neighbourIndex,
        internalArrayIndex,
        dimension,
        currentDimensionValue,
        existingPoint,
        existingPointDistance;

    var pointDistance = this.distanceFunction(point);

    for (neighbourIndex = 0; neighbourIndex < this.neighbourhood.length; neighbourIndex++) {
        internalArrayIndex = 0;

        for (dimension = 0; dimension < dimensionNumber; dimension++) {
            currentDimensionValue = ((point[dimension] / this.cellSize) | 0) + this.neighbourhood[neighbourIndex][dimension];

            if (currentDimensionValue < 0 || currentDimensionValue >= this.gridShape[dimension]) {
                internalArrayIndex = -1;
                break;
            }

            internalArrayIndex += currentDimensionValue * stride[dimension];
        }

        if (internalArrayIndex !== -1 && this.grid.data[internalArrayIndex].length > 0) {
            for (var i = 0; i < this.grid.data[internalArrayIndex].length; i++) {
                existingPoint = this.samplePoints[this.grid.data[internalArrayIndex][i]];
                existingPointDistance = this.sampleDistance[this.grid.data[internalArrayIndex][i]];

                var minDistance = Math.min(existingPointDistance, pointDistance);
                var maxDistance = Math.max(existingPointDistance, pointDistance);
                var dist = minDistance + (maxDistance - minDistance) * this.bias;

                if (euclideanDistance(point, existingPoint) < this.minDistance + this.deltaDistance * dist) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * Try to generate a new point in the grid, returns null if it wasn't possible
 * @returns {Array|null} The added point or null
 */
VariableDensityPDS.prototype.next = function () {
    var tries,
        angle,
        distance,
        currentPoint,
        currentDistance,
        newPoint,
        inShape,
        i;

    while (this.processList.length > 0) {
        if (this.currentPoint === null) {
            var sampleIndex = this.processList.shift();
            this.currentPoint = this.samplePoints[sampleIndex];
            this.currentDistance = this.sampleDistance[sampleIndex];
        }

        currentPoint = this.currentPoint;
        currentDistance = this.currentDistance;

        for (tries = 0; tries < this.maxTries; tries++) {
            inShape = true;
            distance = this.minDistancePlusEpsilon + this.deltaDistance * (currentDistance + (1 - currentDistance) * this.bias);

            if (this.dimension === 2) {
                angle = this.rng() * Math.PI * 2;
                newPoint = [
                    Math.cos(angle),
                    Math.sin(angle)
                ];
            } else {
                newPoint = sampleSphere(this.dimension, this.rng);
            }

            for (i = 0; inShape && i < this.dimension; i++) {
                newPoint[i] = currentPoint[i] + newPoint[i] * distance;
                inShape = (newPoint[i] >= 0 && newPoint[i] < this.shape[i])
            }

            if (inShape && !this.inNeighbourhood(newPoint)) {
                return this.directAddPoint(newPoint);
            }
        }

        if (tries === this.maxTries) {
            this.currentPoint = null;
        }
    }

    return null;
};

/**
 * Automatically fill the grid, adding a random point to start the process if needed.
 * Will block the thread, probably best to use it in a web worker or child process.
 * @returns {Array[]} Sample points
 */
VariableDensityPDS.prototype.fill = function () {
    if (this.samplePoints.length === 0) {
        this.addRandomPoint();
    }

    while (this.next()) {}

    return this.samplePoints;
};

/**
 * Get all the points in the grid.
 * @returns {Array[]} Sample points
 */
VariableDensityPDS.prototype.getAllPoints = function () {
    return this.samplePoints;
};

/**
 * Get all the points in the grid along with the result of the distance function.
 * @returns {Array[]} Sample points with their distance function result
 */
VariableDensityPDS.prototype.getAllPointsWithDistance = function () {
    var result = new Array(this.samplePoints.length),
        i = 0,
        dimension = 0,
        point;

    for (i = 0; i < this.samplePoints.length; i++) {
        point = new Array(this.dimension + 1);

        for (dimension = 0; dimension < this.dimension; dimension++) {
            point[dimension] = this.samplePoints[i][dimension];
        }

        point[this.dimension] = this.sampleDistance[i];

        result[i] = point;
    }

    return result;
};

/**
 * Reinitialize the grid as well as the internal state
 */
VariableDensityPDS.prototype.reset = function () {
    var gridData = this.grid.data,
        i = 0;

    // reset the cache grid
    for (i = 0; i < gridData.length; i++) {
        gridData[i] = [];
    }

    // new array for the samplePoints as it is passed by reference to the outside
    this.samplePoints = [];

    // reset the internal state
    this.currentPoint = null;
    this.processList.length = 0;
};


/**
 * Wrapper that hides away helpful transformations when using PoissonDiskSampling 
 * (Not part of poisson-disk-sampling module, written by Mathias Isaksen)
 * @param {object} options Options
 * @param {Array} options.extent Extent of space of interest, array of format [xMin, xMax, yMin, yMax]
 * @param {float} options.minDistance Minimum distance between each points
 * @param {float} [options.maxDistance] Maximum distance between each points, defaults to minDistance * 2
 * @param {int} [options.tries] Number of times the algorithm will try to place a point in the neighbourhood of another points, defaults to 30
 * @param {function|null} [options.distanceFunction] Function to control the distance between each point depending on their position, must return a value between 0 and 1
 * @param {function|null} [options.bias] When using a distanceFunction, will indicate which point constraint takes priority when evaluating two points (0 for the lowest distance, 1 for the highest distance), defaults to 0
 * @param {function|null} [rng] RNG function, defaults to Math.random
 * @constructor
 */
export function Poisson2D(options, rng) {
    this.options = options;
    const [xMin, xMax, yMin, yMax] = options.extent;

    const width = xMax - xMin;
    const height = yMax - yMin;
    options.shape = [width, height];

    if (options.distanceFunction) {
        const distFunc = options.distanceFunction;
        options.distanceFunction = p => {
            const pTrans = [p[0] + xMin, p[1] + yMin];
            return distFunc(pTrans);
        }
    }

    this.pdsObject = new PoissonDiskSampling(options, rng);
    this.pdsObject.addRandomPoint();

}

Poisson2D.prototype.transformPoint = function(p) {
    const [xMin, xMax, yMin, yMax] = this.options.extent;
    let [x, y] = p;
    x += xMin;
    y += yMin;
    return [x, y];
}

Poisson2D.prototype.fill = function() {
    return this.pdsObject.fill().map(p => this.transformPoint(p));
}

Poisson2D.prototype.next = function() {
    const point = this.pdsObject.next();
    if (point === null) return null;
    return this.transformPoint(point);
}

Poisson2D.prototype.getLastDistance = function() {
    return this.pdsObject.getLastDistance();
}

/**
 * Return distance value of last point (added by Mathias Isaksen).
 * @returns {float} Distance value
 */
FixedDensityPDS.prototype.getLastDistance = function () {
    return null;
};

/**
 * Return distance value of last point (added by Mathias Isaksen).
 * @returns {float} Distance value
 */
PoissonDiskSampling.prototype.getLastDistance = function () {
    return this.implementation.getLastDistance();
};

/**
 * Return distance value of last point (added by Mathias Isaksen).
 * @returns {float} Distance value
 */
VariableDensityPDS.prototype.getLastDistance = function () {
    return this.sampleDistance[this.sampleDistance.length - 1];
};