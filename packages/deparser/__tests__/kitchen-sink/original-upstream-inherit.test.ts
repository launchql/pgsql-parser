
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-upstream-inherit', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/inherit-1.sql",
  "original/upstream/inherit-2.sql",
  "original/upstream/inherit-3.sql",
  "original/upstream/inherit-4.sql",
  "original/upstream/inherit-5.sql",
  "original/upstream/inherit-6.sql",
  "original/upstream/inherit-7.sql",
  "original/upstream/inherit-8.sql",
  "original/upstream/inherit-9.sql",
  "original/upstream/inherit-10.sql",
  "original/upstream/inherit-11.sql",
  "original/upstream/inherit-12.sql",
  "original/upstream/inherit-13.sql",
  "original/upstream/inherit-14.sql",
  "original/upstream/inherit-15.sql",
  "original/upstream/inherit-16.sql",
  "original/upstream/inherit-17.sql",
  "original/upstream/inherit-18.sql",
  "original/upstream/inherit-19.sql",
  "original/upstream/inherit-20.sql",
  "original/upstream/inherit-21.sql",
  "original/upstream/inherit-22.sql",
  "original/upstream/inherit-23.sql",
  "original/upstream/inherit-24.sql",
  "original/upstream/inherit-25.sql",
  "original/upstream/inherit-26.sql",
  "original/upstream/inherit-27.sql",
  "original/upstream/inherit-28.sql",
  "original/upstream/inherit-29.sql",
  "original/upstream/inherit-30.sql",
  "original/upstream/inherit-31.sql",
  "original/upstream/inherit-32.sql",
  "original/upstream/inherit-33.sql",
  "original/upstream/inherit-34.sql",
  "original/upstream/inherit-35.sql",
  "original/upstream/inherit-36.sql",
  "original/upstream/inherit-37.sql",
  "original/upstream/inherit-38.sql",
  "original/upstream/inherit-39.sql",
  "original/upstream/inherit-40.sql",
  "original/upstream/inherit-41.sql",
  "original/upstream/inherit-42.sql",
  "original/upstream/inherit-43.sql",
  "original/upstream/inherit-44.sql",
  "original/upstream/inherit-45.sql",
  "original/upstream/inherit-46.sql",
  "original/upstream/inherit-47.sql",
  "original/upstream/inherit-48.sql",
  "original/upstream/inherit-49.sql",
  "original/upstream/inherit-50.sql",
  "original/upstream/inherit-51.sql",
  "original/upstream/inherit-52.sql",
  "original/upstream/inherit-53.sql",
  "original/upstream/inherit-54.sql",
  "original/upstream/inherit-55.sql",
  "original/upstream/inherit-56.sql",
  "original/upstream/inherit-57.sql",
  "original/upstream/inherit-58.sql",
  "original/upstream/inherit-59.sql",
  "original/upstream/inherit-60.sql",
  "original/upstream/inherit-61.sql",
  "original/upstream/inherit-62.sql",
  "original/upstream/inherit-63.sql",
  "original/upstream/inherit-64.sql",
  "original/upstream/inherit-65.sql",
  "original/upstream/inherit-66.sql",
  "original/upstream/inherit-67.sql",
  "original/upstream/inherit-68.sql",
  "original/upstream/inherit-69.sql",
  "original/upstream/inherit-70.sql",
  "original/upstream/inherit-71.sql",
  "original/upstream/inherit-72.sql",
  "original/upstream/inherit-73.sql",
  "original/upstream/inherit-74.sql",
  "original/upstream/inherit-75.sql",
  "original/upstream/inherit-76.sql",
  "original/upstream/inherit-77.sql",
  "original/upstream/inherit-78.sql",
  "original/upstream/inherit-79.sql",
  "original/upstream/inherit-80.sql",
  "original/upstream/inherit-81.sql",
  "original/upstream/inherit-82.sql",
  "original/upstream/inherit-83.sql",
  "original/upstream/inherit-84.sql",
  "original/upstream/inherit-85.sql",
  "original/upstream/inherit-86.sql",
  "original/upstream/inherit-87.sql",
  "original/upstream/inherit-88.sql",
  "original/upstream/inherit-89.sql",
  "original/upstream/inherit-90.sql",
  "original/upstream/inherit-91.sql",
  "original/upstream/inherit-92.sql",
  "original/upstream/inherit-93.sql",
  "original/upstream/inherit-94.sql",
  "original/upstream/inherit-95.sql",
  "original/upstream/inherit-96.sql",
  "original/upstream/inherit-97.sql",
  "original/upstream/inherit-98.sql",
  "original/upstream/inherit-99.sql",
  "original/upstream/inherit-100.sql",
  "original/upstream/inherit-101.sql",
  "original/upstream/inherit-102.sql",
  "original/upstream/inherit-103.sql",
  "original/upstream/inherit-104.sql",
  "original/upstream/inherit-105.sql",
  "original/upstream/inherit-106.sql",
  "original/upstream/inherit-107.sql",
  "original/upstream/inherit-108.sql",
  "original/upstream/inherit-109.sql",
  "original/upstream/inherit-110.sql",
  "original/upstream/inherit-111.sql",
  "original/upstream/inherit-112.sql",
  "original/upstream/inherit-113.sql",
  "original/upstream/inherit-114.sql",
  "original/upstream/inherit-115.sql",
  "original/upstream/inherit-116.sql",
  "original/upstream/inherit-117.sql",
  "original/upstream/inherit-118.sql",
  "original/upstream/inherit-119.sql",
  "original/upstream/inherit-120.sql",
  "original/upstream/inherit-121.sql",
  "original/upstream/inherit-122.sql",
  "original/upstream/inherit-123.sql",
  "original/upstream/inherit-124.sql",
  "original/upstream/inherit-125.sql",
  "original/upstream/inherit-126.sql",
  "original/upstream/inherit-127.sql",
  "original/upstream/inherit-128.sql",
  "original/upstream/inherit-129.sql",
  "original/upstream/inherit-130.sql",
  "original/upstream/inherit-131.sql",
  "original/upstream/inherit-132.sql",
  "original/upstream/inherit-133.sql",
  "original/upstream/inherit-134.sql",
  "original/upstream/inherit-135.sql",
  "original/upstream/inherit-136.sql",
  "original/upstream/inherit-137.sql",
  "original/upstream/inherit-138.sql",
  "original/upstream/inherit-139.sql",
  "original/upstream/inherit-140.sql",
  "original/upstream/inherit-141.sql",
  "original/upstream/inherit-142.sql",
  "original/upstream/inherit-143.sql",
  "original/upstream/inherit-144.sql",
  "original/upstream/inherit-145.sql",
  "original/upstream/inherit-146.sql",
  "original/upstream/inherit-147.sql",
  "original/upstream/inherit-148.sql",
  "original/upstream/inherit-149.sql",
  "original/upstream/inherit-150.sql",
  "original/upstream/inherit-151.sql",
  "original/upstream/inherit-152.sql",
  "original/upstream/inherit-153.sql",
  "original/upstream/inherit-154.sql",
  "original/upstream/inherit-155.sql",
  "original/upstream/inherit-156.sql",
  "original/upstream/inherit-157.sql",
  "original/upstream/inherit-158.sql",
  "original/upstream/inherit-159.sql",
  "original/upstream/inherit-160.sql",
  "original/upstream/inherit-161.sql",
  "original/upstream/inherit-162.sql",
  "original/upstream/inherit-163.sql",
  "original/upstream/inherit-164.sql",
  "original/upstream/inherit-165.sql",
  "original/upstream/inherit-166.sql",
  "original/upstream/inherit-167.sql",
  "original/upstream/inherit-168.sql",
  "original/upstream/inherit-169.sql",
  "original/upstream/inherit-170.sql",
  "original/upstream/inherit-171.sql",
  "original/upstream/inherit-172.sql",
  "original/upstream/inherit-173.sql",
  "original/upstream/inherit-174.sql",
  "original/upstream/inherit-175.sql",
  "original/upstream/inherit-176.sql",
  "original/upstream/inherit-177.sql",
  "original/upstream/inherit-178.sql",
  "original/upstream/inherit-179.sql",
  "original/upstream/inherit-180.sql",
  "original/upstream/inherit-181.sql",
  "original/upstream/inherit-182.sql",
  "original/upstream/inherit-183.sql",
  "original/upstream/inherit-184.sql",
  "original/upstream/inherit-185.sql",
  "original/upstream/inherit-186.sql",
  "original/upstream/inherit-187.sql",
  "original/upstream/inherit-188.sql",
  "original/upstream/inherit-189.sql",
  "original/upstream/inherit-190.sql",
  "original/upstream/inherit-191.sql",
  "original/upstream/inherit-192.sql",
  "original/upstream/inherit-193.sql",
  "original/upstream/inherit-194.sql",
  "original/upstream/inherit-195.sql",
  "original/upstream/inherit-196.sql",
  "original/upstream/inherit-197.sql",
  "original/upstream/inherit-198.sql",
  "original/upstream/inherit-199.sql",
  "original/upstream/inherit-200.sql",
  "original/upstream/inherit-201.sql",
  "original/upstream/inherit-202.sql",
  "original/upstream/inherit-203.sql",
  "original/upstream/inherit-204.sql",
  "original/upstream/inherit-205.sql",
  "original/upstream/inherit-206.sql",
  "original/upstream/inherit-207.sql",
  "original/upstream/inherit-208.sql",
  "original/upstream/inherit-209.sql",
  "original/upstream/inherit-210.sql",
  "original/upstream/inherit-211.sql",
  "original/upstream/inherit-212.sql",
  "original/upstream/inherit-213.sql",
  "original/upstream/inherit-214.sql",
  "original/upstream/inherit-215.sql",
  "original/upstream/inherit-216.sql",
  "original/upstream/inherit-217.sql",
  "original/upstream/inherit-218.sql",
  "original/upstream/inherit-219.sql",
  "original/upstream/inherit-220.sql",
  "original/upstream/inherit-221.sql",
  "original/upstream/inherit-222.sql",
  "original/upstream/inherit-223.sql",
  "original/upstream/inherit-224.sql",
  "original/upstream/inherit-225.sql",
  "original/upstream/inherit-226.sql",
  "original/upstream/inherit-227.sql",
  "original/upstream/inherit-228.sql",
  "original/upstream/inherit-229.sql",
  "original/upstream/inherit-230.sql",
  "original/upstream/inherit-231.sql",
  "original/upstream/inherit-232.sql",
  "original/upstream/inherit-233.sql",
  "original/upstream/inherit-234.sql",
  "original/upstream/inherit-235.sql",
  "original/upstream/inherit-236.sql",
  "original/upstream/inherit-237.sql",
  "original/upstream/inherit-238.sql",
  "original/upstream/inherit-239.sql",
  "original/upstream/inherit-240.sql",
  "original/upstream/inherit-241.sql",
  "original/upstream/inherit-242.sql",
  "original/upstream/inherit-243.sql",
  "original/upstream/inherit-244.sql",
  "original/upstream/inherit-245.sql",
  "original/upstream/inherit-246.sql",
  "original/upstream/inherit-247.sql",
  "original/upstream/inherit-248.sql",
  "original/upstream/inherit-249.sql",
  "original/upstream/inherit-250.sql",
  "original/upstream/inherit-251.sql",
  "original/upstream/inherit-252.sql",
  "original/upstream/inherit-253.sql",
  "original/upstream/inherit-254.sql",
  "original/upstream/inherit-255.sql",
  "original/upstream/inherit-256.sql",
  "original/upstream/inherit-257.sql",
  "original/upstream/inherit-258.sql",
  "original/upstream/inherit-259.sql",
  "original/upstream/inherit-260.sql",
  "original/upstream/inherit-261.sql",
  "original/upstream/inherit-262.sql",
  "original/upstream/inherit-263.sql",
  "original/upstream/inherit-264.sql",
  "original/upstream/inherit-265.sql",
  "original/upstream/inherit-266.sql",
  "original/upstream/inherit-267.sql",
  "original/upstream/inherit-268.sql",
  "original/upstream/inherit-269.sql",
  "original/upstream/inherit-270.sql",
  "original/upstream/inherit-271.sql",
  "original/upstream/inherit-272.sql",
  "original/upstream/inherit-273.sql",
  "original/upstream/inherit-274.sql",
  "original/upstream/inherit-275.sql",
  "original/upstream/inherit-276.sql",
  "original/upstream/inherit-277.sql",
  "original/upstream/inherit-278.sql",
  "original/upstream/inherit-279.sql",
  "original/upstream/inherit-280.sql",
  "original/upstream/inherit-281.sql",
  "original/upstream/inherit-282.sql",
  "original/upstream/inherit-283.sql",
  "original/upstream/inherit-284.sql",
  "original/upstream/inherit-285.sql",
  "original/upstream/inherit-286.sql",
  "original/upstream/inherit-287.sql",
  "original/upstream/inherit-288.sql",
  "original/upstream/inherit-289.sql"
]);
});
