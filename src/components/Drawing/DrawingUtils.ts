type TRect = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}
// Check if rectangle a contains rectangle b
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
const contains = (a: TRect, b: TRect) => {
	return !(
		b.x1 < a.x1 ||
		b.y1 < a.y1 ||
		b.x2 > a.x2 ||
		b.y2 > a.y2
	);
}

// Check if rectangle a overlaps rectangle b
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
const overlaps = (a: TRect, b: TRect) => {
	// no horizontal overlap
	if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

	// no vertical overlap
	if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

	return true;
}

// Check if rectangle a touches rectangle b
// Each object (a and b) should have 2 properties to represent the
// top-left corner (x1, y1) and 2 for the bottom-right corner (x2, y2).
const touches = (a: TRect, b: TRect) => {
	// has horizontal gap
	if (a.x1 > b.x2 || b.x1 > a.x2) return false;

	// has vertical gap
	if (a.y1 > b.y2 || b.y1 > a.y2) return false;

	return true;
}

export const checkOverlap = (x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number): boolean => {
    const a: TRect = {
      x1: x1,
      y1: y1,
      x2: x1 + w1,
      y2: y1 + h1,
    }
    const b: TRect = {
      x1: x2,
      y1: y2,
      x2: x2 + w2,
      y2: y2 + h2,
    }
    if (contains(a, b) || contains(b, a)) {
      return true;
    }
    if (overlaps(a, b)) {
      return true;
    }
    if (touches(a, b)) {
      return true;
    }
    return false;
}