
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(14, 15);

it('original-upstream-xml', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/xml-1.sql",
  "original/upstream/xml-2.sql",
  "original/upstream/xml-3.sql",
  "original/upstream/xml-4.sql",
  "original/upstream/xml-5.sql",
  "original/upstream/xml-6.sql",
  "original/upstream/xml-7.sql",
  "original/upstream/xml-8.sql",
  "original/upstream/xml-9.sql",
  "original/upstream/xml-10.sql",
  "original/upstream/xml-11.sql",
  "original/upstream/xml-12.sql",
  "original/upstream/xml-13.sql",
  "original/upstream/xml-14.sql",
  "original/upstream/xml-15.sql",
  "original/upstream/xml-16.sql",
  "original/upstream/xml-17.sql",
  "original/upstream/xml-18.sql",
  "original/upstream/xml-19.sql",
  "original/upstream/xml-20.sql",
  "original/upstream/xml-21.sql",
  "original/upstream/xml-22.sql",
  "original/upstream/xml-23.sql",
  "original/upstream/xml-24.sql",
  "original/upstream/xml-25.sql",
  "original/upstream/xml-26.sql",
  "original/upstream/xml-27.sql",
  "original/upstream/xml-28.sql",
  "original/upstream/xml-29.sql",
  "original/upstream/xml-30.sql",
  "original/upstream/xml-31.sql",
  "original/upstream/xml-32.sql",
  "original/upstream/xml-33.sql",
  "original/upstream/xml-34.sql",
  "original/upstream/xml-35.sql",
  "original/upstream/xml-36.sql",
  "original/upstream/xml-37.sql",
  "original/upstream/xml-38.sql",
  "original/upstream/xml-39.sql",
  "original/upstream/xml-40.sql",
  "original/upstream/xml-41.sql",
  "original/upstream/xml-42.sql",
  "original/upstream/xml-43.sql",
  "original/upstream/xml-44.sql",
  "original/upstream/xml-45.sql",
  "original/upstream/xml-46.sql",
  "original/upstream/xml-47.sql",
  "original/upstream/xml-48.sql",
  "original/upstream/xml-49.sql",
  "original/upstream/xml-50.sql",
  "original/upstream/xml-51.sql",
  "original/upstream/xml-52.sql",
  "original/upstream/xml-53.sql",
  "original/upstream/xml-54.sql",
  "original/upstream/xml-55.sql",
  "original/upstream/xml-56.sql",
  "original/upstream/xml-57.sql",
  "original/upstream/xml-58.sql",
  "original/upstream/xml-59.sql",
  "original/upstream/xml-60.sql",
  "original/upstream/xml-61.sql",
  "original/upstream/xml-62.sql",
  "original/upstream/xml-63.sql",
  "original/upstream/xml-64.sql",
  "original/upstream/xml-65.sql",
  "original/upstream/xml-66.sql",
  "original/upstream/xml-67.sql",
  "original/upstream/xml-68.sql",
  "original/upstream/xml-69.sql",
  "original/upstream/xml-70.sql",
  "original/upstream/xml-71.sql",
  "original/upstream/xml-72.sql",
  "original/upstream/xml-73.sql",
  "original/upstream/xml-74.sql",
  "original/upstream/xml-75.sql",
  "original/upstream/xml-76.sql",
  "original/upstream/xml-77.sql",
  "original/upstream/xml-78.sql",
  "original/upstream/xml-79.sql",
  "original/upstream/xml-80.sql",
  "original/upstream/xml-81.sql",
  "original/upstream/xml-82.sql",
  "original/upstream/xml-83.sql",
  "original/upstream/xml-84.sql",
  "original/upstream/xml-85.sql",
  "original/upstream/xml-86.sql",
  "original/upstream/xml-87.sql",
  "original/upstream/xml-88.sql",
  "original/upstream/xml-89.sql",
  "original/upstream/xml-90.sql",
  "original/upstream/xml-91.sql",
  "original/upstream/xml-92.sql",
  "original/upstream/xml-93.sql",
  "original/upstream/xml-94.sql",
  "original/upstream/xml-95.sql",
  "original/upstream/xml-96.sql",
  "original/upstream/xml-97.sql",
  "original/upstream/xml-98.sql",
  "original/upstream/xml-99.sql",
  "original/upstream/xml-100.sql",
  "original/upstream/xml-101.sql",
  "original/upstream/xml-102.sql",
  "original/upstream/xml-103.sql",
  "original/upstream/xml-104.sql",
  "original/upstream/xml-105.sql",
  "original/upstream/xml-106.sql",
  "original/upstream/xml-107.sql",
  "original/upstream/xml-108.sql",
  "original/upstream/xml-109.sql",
  "original/upstream/xml-110.sql",
  "original/upstream/xml-111.sql",
  "original/upstream/xml-112.sql",
  "original/upstream/xml-113.sql",
  "original/upstream/xml-114.sql",
  "original/upstream/xml-115.sql",
  "original/upstream/xml-116.sql",
  "original/upstream/xml-117.sql",
  "original/upstream/xml-118.sql",
  "original/upstream/xml-119.sql",
  "original/upstream/xml-120.sql",
  "original/upstream/xml-121.sql",
  "original/upstream/xml-122.sql",
  "original/upstream/xml-123.sql",
  "original/upstream/xml-124.sql",
  "original/upstream/xml-125.sql",
  "original/upstream/xml-126.sql",
  "original/upstream/xml-127.sql",
  "original/upstream/xml-128.sql",
  "original/upstream/xml-129.sql",
  "original/upstream/xml-130.sql",
  "original/upstream/xml-131.sql",
  "original/upstream/xml-132.sql",
  "original/upstream/xml-133.sql",
  "original/upstream/xml-134.sql",
  "original/upstream/xml-135.sql",
  "original/upstream/xml-136.sql",
  "original/upstream/xml-137.sql",
  "original/upstream/xml-138.sql",
  "original/upstream/xml-139.sql",
  "original/upstream/xml-140.sql",
  "original/upstream/xml-141.sql",
  "original/upstream/xml-142.sql",
  "original/upstream/xml-143.sql",
  "original/upstream/xml-144.sql",
  "original/upstream/xml-145.sql",
  "original/upstream/xml-146.sql",
  "original/upstream/xml-147.sql",
  "original/upstream/xml-148.sql",
  "original/upstream/xml-149.sql",
  "original/upstream/xml-150.sql",
  "original/upstream/xml-151.sql",
  "original/upstream/xml-152.sql",
  "original/upstream/xml-153.sql",
  "original/upstream/xml-154.sql",
  "original/upstream/xml-155.sql",
  "original/upstream/xml-156.sql",
  "original/upstream/xml-157.sql",
  "original/upstream/xml-158.sql",
  "original/upstream/xml-159.sql",
  "original/upstream/xml-160.sql",
  "original/upstream/xml-161.sql",
  "original/upstream/xml-162.sql",
  "original/upstream/xml-163.sql",
  "original/upstream/xml-164.sql",
  "original/upstream/xml-165.sql",
  "original/upstream/xml-166.sql",
  "original/upstream/xml-167.sql",
  "original/upstream/xml-168.sql",
  "original/upstream/xml-169.sql",
  "original/upstream/xml-170.sql",
  "original/upstream/xml-171.sql"
]);
});
