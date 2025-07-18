
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-upstream-domain', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/domain-1.sql",
  "original/upstream/domain-2.sql",
  "original/upstream/domain-3.sql",
  "original/upstream/domain-4.sql",
  "original/upstream/domain-5.sql",
  "original/upstream/domain-6.sql",
  "original/upstream/domain-7.sql",
  "original/upstream/domain-8.sql",
  "original/upstream/domain-9.sql",
  "original/upstream/domain-10.sql",
  "original/upstream/domain-11.sql",
  "original/upstream/domain-12.sql",
  "original/upstream/domain-13.sql",
  "original/upstream/domain-14.sql",
  "original/upstream/domain-15.sql",
  "original/upstream/domain-16.sql",
  "original/upstream/domain-17.sql",
  "original/upstream/domain-18.sql",
  "original/upstream/domain-19.sql",
  "original/upstream/domain-20.sql",
  "original/upstream/domain-21.sql",
  "original/upstream/domain-22.sql",
  "original/upstream/domain-23.sql",
  "original/upstream/domain-24.sql",
  "original/upstream/domain-25.sql",
  "original/upstream/domain-26.sql",
  "original/upstream/domain-27.sql",
  "original/upstream/domain-28.sql",
  "original/upstream/domain-29.sql",
  "original/upstream/domain-30.sql",
  "original/upstream/domain-31.sql",
  "original/upstream/domain-32.sql",
  "original/upstream/domain-33.sql",
  "original/upstream/domain-34.sql",
  "original/upstream/domain-35.sql",
  "original/upstream/domain-36.sql",
  "original/upstream/domain-37.sql",
  "original/upstream/domain-38.sql",
  "original/upstream/domain-39.sql",
  "original/upstream/domain-40.sql",
  "original/upstream/domain-41.sql",
  "original/upstream/domain-42.sql",
  "original/upstream/domain-43.sql",
  "original/upstream/domain-44.sql",
  "original/upstream/domain-45.sql",
  "original/upstream/domain-46.sql",
  "original/upstream/domain-47.sql",
  "original/upstream/domain-48.sql",
  "original/upstream/domain-49.sql",
  "original/upstream/domain-50.sql",
  "original/upstream/domain-51.sql",
  "original/upstream/domain-52.sql",
  "original/upstream/domain-53.sql",
  "original/upstream/domain-54.sql",
  "original/upstream/domain-55.sql",
  "original/upstream/domain-56.sql",
  "original/upstream/domain-57.sql",
  "original/upstream/domain-58.sql",
  "original/upstream/domain-59.sql",
  "original/upstream/domain-60.sql",
  "original/upstream/domain-61.sql",
  "original/upstream/domain-62.sql",
  "original/upstream/domain-63.sql",
  "original/upstream/domain-64.sql",
  "original/upstream/domain-65.sql",
  "original/upstream/domain-66.sql",
  "original/upstream/domain-67.sql",
  "original/upstream/domain-68.sql",
  "original/upstream/domain-69.sql",
  "original/upstream/domain-70.sql",
  "original/upstream/domain-71.sql",
  "original/upstream/domain-72.sql",
  "original/upstream/domain-73.sql",
  "original/upstream/domain-74.sql",
  "original/upstream/domain-75.sql",
  "original/upstream/domain-76.sql",
  "original/upstream/domain-77.sql",
  "original/upstream/domain-78.sql",
  "original/upstream/domain-79.sql",
  "original/upstream/domain-80.sql",
  "original/upstream/domain-81.sql",
  "original/upstream/domain-82.sql",
  "original/upstream/domain-83.sql",
  "original/upstream/domain-84.sql",
  "original/upstream/domain-85.sql",
  "original/upstream/domain-86.sql",
  "original/upstream/domain-87.sql",
  "original/upstream/domain-88.sql",
  "original/upstream/domain-89.sql",
  "original/upstream/domain-90.sql",
  "original/upstream/domain-91.sql",
  "original/upstream/domain-92.sql",
  "original/upstream/domain-93.sql",
  "original/upstream/domain-94.sql",
  "original/upstream/domain-95.sql",
  "original/upstream/domain-96.sql",
  "original/upstream/domain-97.sql",
  "original/upstream/domain-98.sql",
  "original/upstream/domain-99.sql",
  "original/upstream/domain-100.sql",
  "original/upstream/domain-101.sql",
  "original/upstream/domain-102.sql",
  "original/upstream/domain-103.sql",
  "original/upstream/domain-104.sql",
  "original/upstream/domain-105.sql",
  "original/upstream/domain-106.sql",
  "original/upstream/domain-107.sql",
  "original/upstream/domain-108.sql",
  "original/upstream/domain-109.sql",
  "original/upstream/domain-110.sql",
  "original/upstream/domain-111.sql",
  "original/upstream/domain-112.sql",
  "original/upstream/domain-113.sql",
  "original/upstream/domain-114.sql",
  "original/upstream/domain-115.sql",
  "original/upstream/domain-116.sql",
  "original/upstream/domain-117.sql",
  "original/upstream/domain-118.sql",
  "original/upstream/domain-119.sql",
  "original/upstream/domain-120.sql",
  "original/upstream/domain-121.sql",
  "original/upstream/domain-122.sql",
  "original/upstream/domain-123.sql",
  "original/upstream/domain-124.sql",
  "original/upstream/domain-125.sql",
  "original/upstream/domain-126.sql",
  "original/upstream/domain-127.sql",
  "original/upstream/domain-128.sql",
  "original/upstream/domain-129.sql",
  "original/upstream/domain-130.sql",
  "original/upstream/domain-131.sql",
  "original/upstream/domain-132.sql",
  "original/upstream/domain-133.sql",
  "original/upstream/domain-134.sql",
  "original/upstream/domain-135.sql",
  "original/upstream/domain-136.sql",
  "original/upstream/domain-137.sql",
  "original/upstream/domain-138.sql",
  "original/upstream/domain-139.sql",
  "original/upstream/domain-140.sql",
  "original/upstream/domain-141.sql",
  "original/upstream/domain-142.sql",
  "original/upstream/domain-143.sql",
  "original/upstream/domain-144.sql",
  "original/upstream/domain-145.sql",
  "original/upstream/domain-146.sql",
  "original/upstream/domain-147.sql",
  "original/upstream/domain-148.sql",
  "original/upstream/domain-149.sql",
  "original/upstream/domain-150.sql",
  "original/upstream/domain-151.sql",
  "original/upstream/domain-152.sql",
  "original/upstream/domain-153.sql",
  "original/upstream/domain-154.sql",
  "original/upstream/domain-155.sql",
  "original/upstream/domain-156.sql",
  "original/upstream/domain-157.sql",
  "original/upstream/domain-158.sql",
  "original/upstream/domain-159.sql",
  "original/upstream/domain-160.sql",
  "original/upstream/domain-161.sql",
  "original/upstream/domain-162.sql",
  "original/upstream/domain-163.sql",
  "original/upstream/domain-164.sql",
  "original/upstream/domain-165.sql",
  "original/upstream/domain-166.sql",
  "original/upstream/domain-167.sql",
  "original/upstream/domain-168.sql",
  "original/upstream/domain-169.sql",
  "original/upstream/domain-170.sql",
  "original/upstream/domain-171.sql",
  "original/upstream/domain-172.sql",
  "original/upstream/domain-173.sql",
  "original/upstream/domain-174.sql",
  "original/upstream/domain-175.sql",
  "original/upstream/domain-176.sql",
  "original/upstream/domain-177.sql",
  "original/upstream/domain-178.sql",
  "original/upstream/domain-179.sql",
  "original/upstream/domain-180.sql",
  "original/upstream/domain-181.sql",
  "original/upstream/domain-182.sql",
  "original/upstream/domain-183.sql",
  "original/upstream/domain-184.sql",
  "original/upstream/domain-185.sql",
  "original/upstream/domain-186.sql",
  "original/upstream/domain-187.sql",
  "original/upstream/domain-188.sql",
  "original/upstream/domain-189.sql",
  "original/upstream/domain-190.sql",
  "original/upstream/domain-191.sql",
  "original/upstream/domain-192.sql",
  "original/upstream/domain-193.sql",
  "original/upstream/domain-194.sql",
  "original/upstream/domain-195.sql",
  "original/upstream/domain-196.sql",
  "original/upstream/domain-197.sql",
  "original/upstream/domain-198.sql",
  "original/upstream/domain-199.sql",
  "original/upstream/domain-200.sql",
  "original/upstream/domain-201.sql",
  "original/upstream/domain-202.sql",
  "original/upstream/domain-203.sql",
  "original/upstream/domain-204.sql",
  "original/upstream/domain-205.sql",
  "original/upstream/domain-206.sql",
  "original/upstream/domain-207.sql",
  "original/upstream/domain-208.sql",
  "original/upstream/domain-209.sql",
  "original/upstream/domain-210.sql",
  "original/upstream/domain-211.sql",
  "original/upstream/domain-212.sql",
  "original/upstream/domain-213.sql",
  "original/upstream/domain-214.sql",
  "original/upstream/domain-215.sql",
  "original/upstream/domain-216.sql",
  "original/upstream/domain-217.sql",
  "original/upstream/domain-218.sql",
  "original/upstream/domain-219.sql",
  "original/upstream/domain-220.sql",
  "original/upstream/domain-221.sql",
  "original/upstream/domain-222.sql",
  "original/upstream/domain-223.sql",
  "original/upstream/domain-224.sql",
  "original/upstream/domain-225.sql",
  "original/upstream/domain-226.sql",
  "original/upstream/domain-227.sql",
  "original/upstream/domain-228.sql",
  "original/upstream/domain-229.sql",
  "original/upstream/domain-230.sql",
  "original/upstream/domain-231.sql",
  "original/upstream/domain-232.sql",
  "original/upstream/domain-233.sql",
  "original/upstream/domain-234.sql",
  "original/upstream/domain-235.sql",
  "original/upstream/domain-236.sql",
  "original/upstream/domain-237.sql",
  "original/upstream/domain-238.sql",
  "original/upstream/domain-239.sql",
  "original/upstream/domain-240.sql",
  "original/upstream/domain-241.sql",
  "original/upstream/domain-242.sql",
  "original/upstream/domain-243.sql",
  "original/upstream/domain-244.sql",
  "original/upstream/domain-245.sql",
  "original/upstream/domain-246.sql",
  "original/upstream/domain-247.sql",
  "original/upstream/domain-248.sql",
  "original/upstream/domain-249.sql",
  "original/upstream/domain-250.sql",
  "original/upstream/domain-251.sql",
  "original/upstream/domain-252.sql",
  "original/upstream/domain-253.sql",
  "original/upstream/domain-254.sql",
  "original/upstream/domain-255.sql",
  "original/upstream/domain-256.sql",
  "original/upstream/domain-257.sql",
  "original/upstream/domain-258.sql",
  "original/upstream/domain-259.sql",
  "original/upstream/domain-260.sql",
  "original/upstream/domain-261.sql",
  "original/upstream/domain-262.sql"
]);
});
