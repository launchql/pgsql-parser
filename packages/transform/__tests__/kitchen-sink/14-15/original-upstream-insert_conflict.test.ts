
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(14, 15);

it('original-upstream-insert_conflict', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/insert_conflict-1.sql",
  "original/upstream/insert_conflict-2.sql",
  "original/upstream/insert_conflict-3.sql",
  "original/upstream/insert_conflict-4.sql",
  "original/upstream/insert_conflict-5.sql",
  "original/upstream/insert_conflict-6.sql",
  "original/upstream/insert_conflict-7.sql",
  "original/upstream/insert_conflict-8.sql",
  "original/upstream/insert_conflict-9.sql",
  "original/upstream/insert_conflict-10.sql",
  "original/upstream/insert_conflict-11.sql",
  "original/upstream/insert_conflict-12.sql",
  "original/upstream/insert_conflict-13.sql",
  "original/upstream/insert_conflict-14.sql",
  "original/upstream/insert_conflict-15.sql",
  "original/upstream/insert_conflict-16.sql",
  "original/upstream/insert_conflict-17.sql",
  "original/upstream/insert_conflict-18.sql",
  "original/upstream/insert_conflict-19.sql",
  "original/upstream/insert_conflict-20.sql",
  "original/upstream/insert_conflict-21.sql",
  "original/upstream/insert_conflict-22.sql",
  "original/upstream/insert_conflict-23.sql",
  "original/upstream/insert_conflict-24.sql",
  "original/upstream/insert_conflict-25.sql",
  "original/upstream/insert_conflict-26.sql",
  "original/upstream/insert_conflict-27.sql",
  "original/upstream/insert_conflict-28.sql",
  "original/upstream/insert_conflict-29.sql",
  "original/upstream/insert_conflict-30.sql",
  "original/upstream/insert_conflict-31.sql",
  "original/upstream/insert_conflict-32.sql",
  "original/upstream/insert_conflict-33.sql",
  "original/upstream/insert_conflict-34.sql",
  "original/upstream/insert_conflict-35.sql",
  "original/upstream/insert_conflict-36.sql",
  "original/upstream/insert_conflict-37.sql",
  "original/upstream/insert_conflict-38.sql",
  "original/upstream/insert_conflict-39.sql",
  "original/upstream/insert_conflict-40.sql",
  "original/upstream/insert_conflict-41.sql",
  "original/upstream/insert_conflict-42.sql",
  "original/upstream/insert_conflict-43.sql",
  "original/upstream/insert_conflict-44.sql",
  "original/upstream/insert_conflict-45.sql",
  "original/upstream/insert_conflict-46.sql",
  "original/upstream/insert_conflict-47.sql",
  "original/upstream/insert_conflict-48.sql",
  "original/upstream/insert_conflict-49.sql",
  "original/upstream/insert_conflict-50.sql",
  "original/upstream/insert_conflict-51.sql",
  "original/upstream/insert_conflict-52.sql",
  "original/upstream/insert_conflict-53.sql",
  "original/upstream/insert_conflict-54.sql",
  "original/upstream/insert_conflict-55.sql",
  "original/upstream/insert_conflict-56.sql",
  "original/upstream/insert_conflict-57.sql",
  "original/upstream/insert_conflict-58.sql",
  "original/upstream/insert_conflict-59.sql",
  "original/upstream/insert_conflict-60.sql",
  "original/upstream/insert_conflict-61.sql",
  "original/upstream/insert_conflict-62.sql",
  "original/upstream/insert_conflict-63.sql",
  "original/upstream/insert_conflict-64.sql",
  "original/upstream/insert_conflict-65.sql",
  "original/upstream/insert_conflict-66.sql",
  "original/upstream/insert_conflict-67.sql",
  "original/upstream/insert_conflict-68.sql",
  "original/upstream/insert_conflict-69.sql",
  "original/upstream/insert_conflict-70.sql",
  "original/upstream/insert_conflict-71.sql",
  "original/upstream/insert_conflict-72.sql",
  "original/upstream/insert_conflict-73.sql",
  "original/upstream/insert_conflict-74.sql",
  "original/upstream/insert_conflict-75.sql",
  "original/upstream/insert_conflict-76.sql",
  "original/upstream/insert_conflict-77.sql",
  "original/upstream/insert_conflict-78.sql",
  "original/upstream/insert_conflict-79.sql",
  "original/upstream/insert_conflict-80.sql",
  "original/upstream/insert_conflict-81.sql",
  "original/upstream/insert_conflict-82.sql",
  "original/upstream/insert_conflict-83.sql",
  "original/upstream/insert_conflict-84.sql",
  "original/upstream/insert_conflict-85.sql",
  "original/upstream/insert_conflict-86.sql",
  "original/upstream/insert_conflict-87.sql",
  "original/upstream/insert_conflict-88.sql",
  "original/upstream/insert_conflict-89.sql",
  "original/upstream/insert_conflict-90.sql",
  "original/upstream/insert_conflict-91.sql",
  "original/upstream/insert_conflict-92.sql",
  "original/upstream/insert_conflict-93.sql",
  "original/upstream/insert_conflict-94.sql",
  "original/upstream/insert_conflict-95.sql",
  "original/upstream/insert_conflict-96.sql",
  "original/upstream/insert_conflict-97.sql",
  "original/upstream/insert_conflict-98.sql",
  "original/upstream/insert_conflict-99.sql",
  "original/upstream/insert_conflict-100.sql",
  "original/upstream/insert_conflict-101.sql",
  "original/upstream/insert_conflict-102.sql",
  "original/upstream/insert_conflict-103.sql",
  "original/upstream/insert_conflict-104.sql",
  "original/upstream/insert_conflict-105.sql",
  "original/upstream/insert_conflict-106.sql",
  "original/upstream/insert_conflict-107.sql",
  "original/upstream/insert_conflict-108.sql",
  "original/upstream/insert_conflict-109.sql",
  "original/upstream/insert_conflict-110.sql",
  "original/upstream/insert_conflict-111.sql",
  "original/upstream/insert_conflict-112.sql",
  "original/upstream/insert_conflict-113.sql",
  "original/upstream/insert_conflict-114.sql",
  "original/upstream/insert_conflict-115.sql",
  "original/upstream/insert_conflict-116.sql",
  "original/upstream/insert_conflict-117.sql",
  "original/upstream/insert_conflict-118.sql",
  "original/upstream/insert_conflict-119.sql",
  "original/upstream/insert_conflict-120.sql",
  "original/upstream/insert_conflict-121.sql",
  "original/upstream/insert_conflict-122.sql",
  "original/upstream/insert_conflict-123.sql",
  "original/upstream/insert_conflict-124.sql",
  "original/upstream/insert_conflict-125.sql",
  "original/upstream/insert_conflict-126.sql",
  "original/upstream/insert_conflict-127.sql",
  "original/upstream/insert_conflict-128.sql",
  "original/upstream/insert_conflict-129.sql",
  "original/upstream/insert_conflict-130.sql",
  "original/upstream/insert_conflict-131.sql",
  "original/upstream/insert_conflict-132.sql",
  "original/upstream/insert_conflict-133.sql",
  "original/upstream/insert_conflict-134.sql",
  "original/upstream/insert_conflict-135.sql",
  "original/upstream/insert_conflict-136.sql",
  "original/upstream/insert_conflict-137.sql",
  "original/upstream/insert_conflict-138.sql",
  "original/upstream/insert_conflict-139.sql",
  "original/upstream/insert_conflict-140.sql",
  "original/upstream/insert_conflict-141.sql",
  "original/upstream/insert_conflict-142.sql",
  "original/upstream/insert_conflict-143.sql",
  "original/upstream/insert_conflict-144.sql",
  "original/upstream/insert_conflict-145.sql",
  "original/upstream/insert_conflict-146.sql",
  "original/upstream/insert_conflict-147.sql",
  "original/upstream/insert_conflict-148.sql",
  "original/upstream/insert_conflict-149.sql",
  "original/upstream/insert_conflict-150.sql",
  "original/upstream/insert_conflict-151.sql",
  "original/upstream/insert_conflict-152.sql",
  "original/upstream/insert_conflict-153.sql",
  "original/upstream/insert_conflict-154.sql",
  "original/upstream/insert_conflict-155.sql",
  "original/upstream/insert_conflict-156.sql",
  "original/upstream/insert_conflict-157.sql",
  "original/upstream/insert_conflict-158.sql",
  "original/upstream/insert_conflict-159.sql",
  "original/upstream/insert_conflict-160.sql"
]);
});
