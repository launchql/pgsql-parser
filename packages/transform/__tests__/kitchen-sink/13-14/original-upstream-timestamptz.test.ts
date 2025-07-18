
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(13, 14);

it('original-upstream-timestamptz', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/timestamptz-1.sql",
  "original/upstream/timestamptz-2.sql",
  "original/upstream/timestamptz-3.sql",
  "original/upstream/timestamptz-4.sql",
  "original/upstream/timestamptz-5.sql",
  "original/upstream/timestamptz-6.sql",
  "original/upstream/timestamptz-7.sql",
  "original/upstream/timestamptz-8.sql",
  "original/upstream/timestamptz-9.sql",
  "original/upstream/timestamptz-10.sql",
  "original/upstream/timestamptz-11.sql",
  "original/upstream/timestamptz-12.sql",
  "original/upstream/timestamptz-13.sql",
  "original/upstream/timestamptz-14.sql",
  "original/upstream/timestamptz-15.sql",
  "original/upstream/timestamptz-16.sql",
  "original/upstream/timestamptz-17.sql",
  "original/upstream/timestamptz-18.sql",
  "original/upstream/timestamptz-19.sql",
  "original/upstream/timestamptz-20.sql",
  "original/upstream/timestamptz-21.sql",
  "original/upstream/timestamptz-22.sql",
  "original/upstream/timestamptz-23.sql",
  "original/upstream/timestamptz-24.sql",
  "original/upstream/timestamptz-25.sql",
  "original/upstream/timestamptz-26.sql",
  "original/upstream/timestamptz-27.sql",
  "original/upstream/timestamptz-28.sql",
  "original/upstream/timestamptz-29.sql",
  "original/upstream/timestamptz-30.sql",
  "original/upstream/timestamptz-31.sql",
  "original/upstream/timestamptz-32.sql",
  "original/upstream/timestamptz-33.sql",
  "original/upstream/timestamptz-34.sql",
  "original/upstream/timestamptz-35.sql",
  "original/upstream/timestamptz-36.sql",
  "original/upstream/timestamptz-37.sql",
  "original/upstream/timestamptz-38.sql",
  "original/upstream/timestamptz-39.sql",
  "original/upstream/timestamptz-40.sql",
  "original/upstream/timestamptz-41.sql",
  "original/upstream/timestamptz-42.sql",
  "original/upstream/timestamptz-43.sql",
  "original/upstream/timestamptz-44.sql",
  "original/upstream/timestamptz-45.sql",
  "original/upstream/timestamptz-46.sql",
  "original/upstream/timestamptz-47.sql",
  "original/upstream/timestamptz-48.sql",
  "original/upstream/timestamptz-49.sql",
  "original/upstream/timestamptz-50.sql",
  "original/upstream/timestamptz-51.sql",
  "original/upstream/timestamptz-52.sql",
  "original/upstream/timestamptz-53.sql",
  "original/upstream/timestamptz-54.sql",
  "original/upstream/timestamptz-55.sql",
  "original/upstream/timestamptz-56.sql",
  "original/upstream/timestamptz-57.sql",
  "original/upstream/timestamptz-58.sql",
  "original/upstream/timestamptz-59.sql",
  "original/upstream/timestamptz-60.sql",
  "original/upstream/timestamptz-61.sql",
  "original/upstream/timestamptz-62.sql",
  "original/upstream/timestamptz-63.sql",
  "original/upstream/timestamptz-64.sql",
  "original/upstream/timestamptz-65.sql",
  "original/upstream/timestamptz-66.sql",
  "original/upstream/timestamptz-67.sql",
  "original/upstream/timestamptz-68.sql",
  "original/upstream/timestamptz-69.sql",
  "original/upstream/timestamptz-70.sql",
  "original/upstream/timestamptz-71.sql",
  "original/upstream/timestamptz-72.sql",
  "original/upstream/timestamptz-73.sql",
  "original/upstream/timestamptz-74.sql",
  "original/upstream/timestamptz-75.sql",
  "original/upstream/timestamptz-76.sql",
  "original/upstream/timestamptz-77.sql",
  "original/upstream/timestamptz-78.sql",
  "original/upstream/timestamptz-79.sql",
  "original/upstream/timestamptz-80.sql",
  "original/upstream/timestamptz-81.sql",
  "original/upstream/timestamptz-82.sql",
  "original/upstream/timestamptz-83.sql",
  "original/upstream/timestamptz-84.sql",
  "original/upstream/timestamptz-85.sql",
  "original/upstream/timestamptz-86.sql",
  "original/upstream/timestamptz-87.sql",
  "original/upstream/timestamptz-88.sql",
  "original/upstream/timestamptz-89.sql",
  "original/upstream/timestamptz-90.sql",
  "original/upstream/timestamptz-91.sql",
  "original/upstream/timestamptz-92.sql",
  "original/upstream/timestamptz-93.sql",
  "original/upstream/timestamptz-94.sql",
  "original/upstream/timestamptz-95.sql",
  "original/upstream/timestamptz-96.sql",
  "original/upstream/timestamptz-97.sql",
  "original/upstream/timestamptz-98.sql",
  "original/upstream/timestamptz-99.sql",
  "original/upstream/timestamptz-100.sql",
  "original/upstream/timestamptz-101.sql",
  "original/upstream/timestamptz-102.sql",
  "original/upstream/timestamptz-103.sql",
  "original/upstream/timestamptz-104.sql",
  "original/upstream/timestamptz-105.sql",
  "original/upstream/timestamptz-106.sql",
  "original/upstream/timestamptz-107.sql",
  "original/upstream/timestamptz-108.sql",
  "original/upstream/timestamptz-109.sql",
  "original/upstream/timestamptz-110.sql",
  "original/upstream/timestamptz-111.sql",
  "original/upstream/timestamptz-112.sql",
  "original/upstream/timestamptz-113.sql",
  "original/upstream/timestamptz-114.sql",
  "original/upstream/timestamptz-115.sql",
  "original/upstream/timestamptz-116.sql",
  "original/upstream/timestamptz-117.sql",
  "original/upstream/timestamptz-118.sql",
  "original/upstream/timestamptz-119.sql",
  "original/upstream/timestamptz-120.sql",
  "original/upstream/timestamptz-121.sql",
  "original/upstream/timestamptz-122.sql",
  "original/upstream/timestamptz-123.sql",
  "original/upstream/timestamptz-124.sql",
  "original/upstream/timestamptz-125.sql",
  "original/upstream/timestamptz-126.sql",
  "original/upstream/timestamptz-127.sql",
  "original/upstream/timestamptz-128.sql",
  "original/upstream/timestamptz-129.sql",
  "original/upstream/timestamptz-130.sql",
  "original/upstream/timestamptz-131.sql",
  "original/upstream/timestamptz-132.sql",
  "original/upstream/timestamptz-133.sql",
  "original/upstream/timestamptz-134.sql",
  "original/upstream/timestamptz-135.sql",
  "original/upstream/timestamptz-136.sql",
  "original/upstream/timestamptz-137.sql",
  "original/upstream/timestamptz-138.sql",
  "original/upstream/timestamptz-139.sql",
  "original/upstream/timestamptz-140.sql",
  "original/upstream/timestamptz-141.sql",
  "original/upstream/timestamptz-142.sql",
  "original/upstream/timestamptz-143.sql",
  "original/upstream/timestamptz-144.sql",
  "original/upstream/timestamptz-145.sql",
  "original/upstream/timestamptz-146.sql",
  "original/upstream/timestamptz-147.sql",
  "original/upstream/timestamptz-148.sql",
  "original/upstream/timestamptz-149.sql",
  "original/upstream/timestamptz-150.sql",
  "original/upstream/timestamptz-151.sql",
  "original/upstream/timestamptz-152.sql",
  "original/upstream/timestamptz-153.sql",
  "original/upstream/timestamptz-154.sql",
  "original/upstream/timestamptz-155.sql",
  "original/upstream/timestamptz-156.sql",
  "original/upstream/timestamptz-157.sql",
  "original/upstream/timestamptz-158.sql",
  "original/upstream/timestamptz-159.sql",
  "original/upstream/timestamptz-160.sql",
  "original/upstream/timestamptz-161.sql",
  "original/upstream/timestamptz-162.sql",
  "original/upstream/timestamptz-163.sql",
  "original/upstream/timestamptz-164.sql",
  "original/upstream/timestamptz-165.sql",
  "original/upstream/timestamptz-166.sql",
  "original/upstream/timestamptz-167.sql",
  "original/upstream/timestamptz-168.sql",
  "original/upstream/timestamptz-169.sql",
  "original/upstream/timestamptz-170.sql",
  "original/upstream/timestamptz-171.sql",
  "original/upstream/timestamptz-172.sql",
  "original/upstream/timestamptz-173.sql",
  "original/upstream/timestamptz-174.sql",
  "original/upstream/timestamptz-175.sql",
  "original/upstream/timestamptz-176.sql",
  "original/upstream/timestamptz-177.sql",
  "original/upstream/timestamptz-178.sql",
  "original/upstream/timestamptz-179.sql",
  "original/upstream/timestamptz-180.sql",
  "original/upstream/timestamptz-181.sql",
  "original/upstream/timestamptz-182.sql",
  "original/upstream/timestamptz-183.sql",
  "original/upstream/timestamptz-184.sql",
  "original/upstream/timestamptz-185.sql",
  "original/upstream/timestamptz-186.sql",
  "original/upstream/timestamptz-187.sql",
  "original/upstream/timestamptz-188.sql",
  "original/upstream/timestamptz-189.sql",
  "original/upstream/timestamptz-190.sql",
  "original/upstream/timestamptz-191.sql",
  "original/upstream/timestamptz-192.sql",
  "original/upstream/timestamptz-193.sql",
  "original/upstream/timestamptz-194.sql",
  "original/upstream/timestamptz-195.sql",
  "original/upstream/timestamptz-196.sql",
  "original/upstream/timestamptz-197.sql",
  "original/upstream/timestamptz-198.sql",
  "original/upstream/timestamptz-199.sql",
  "original/upstream/timestamptz-200.sql",
  "original/upstream/timestamptz-201.sql",
  "original/upstream/timestamptz-202.sql",
  "original/upstream/timestamptz-203.sql",
  "original/upstream/timestamptz-204.sql",
  "original/upstream/timestamptz-205.sql",
  "original/upstream/timestamptz-206.sql",
  "original/upstream/timestamptz-207.sql",
  "original/upstream/timestamptz-208.sql",
  "original/upstream/timestamptz-209.sql",
  "original/upstream/timestamptz-210.sql",
  "original/upstream/timestamptz-211.sql",
  "original/upstream/timestamptz-212.sql",
  "original/upstream/timestamptz-213.sql",
  "original/upstream/timestamptz-214.sql",
  "original/upstream/timestamptz-215.sql",
  "original/upstream/timestamptz-216.sql",
  "original/upstream/timestamptz-217.sql",
  "original/upstream/timestamptz-218.sql",
  "original/upstream/timestamptz-219.sql",
  "original/upstream/timestamptz-220.sql",
  "original/upstream/timestamptz-221.sql",
  "original/upstream/timestamptz-222.sql",
  "original/upstream/timestamptz-223.sql",
  "original/upstream/timestamptz-224.sql",
  "original/upstream/timestamptz-225.sql",
  "original/upstream/timestamptz-226.sql",
  "original/upstream/timestamptz-227.sql",
  "original/upstream/timestamptz-228.sql",
  "original/upstream/timestamptz-229.sql",
  "original/upstream/timestamptz-230.sql",
  "original/upstream/timestamptz-231.sql",
  "original/upstream/timestamptz-232.sql",
  "original/upstream/timestamptz-233.sql",
  "original/upstream/timestamptz-234.sql",
  "original/upstream/timestamptz-235.sql",
  "original/upstream/timestamptz-236.sql",
  "original/upstream/timestamptz-237.sql",
  "original/upstream/timestamptz-238.sql",
  "original/upstream/timestamptz-239.sql",
  "original/upstream/timestamptz-240.sql",
  "original/upstream/timestamptz-241.sql",
  "original/upstream/timestamptz-242.sql",
  "original/upstream/timestamptz-243.sql",
  "original/upstream/timestamptz-244.sql",
  "original/upstream/timestamptz-245.sql",
  "original/upstream/timestamptz-246.sql",
  "original/upstream/timestamptz-247.sql",
  "original/upstream/timestamptz-248.sql",
  "original/upstream/timestamptz-249.sql",
  "original/upstream/timestamptz-250.sql",
  "original/upstream/timestamptz-251.sql",
  "original/upstream/timestamptz-252.sql",
  "original/upstream/timestamptz-253.sql",
  "original/upstream/timestamptz-254.sql",
  "original/upstream/timestamptz-255.sql",
  "original/upstream/timestamptz-256.sql",
  "original/upstream/timestamptz-257.sql",
  "original/upstream/timestamptz-258.sql",
  "original/upstream/timestamptz-259.sql",
  "original/upstream/timestamptz-260.sql",
  "original/upstream/timestamptz-261.sql",
  "original/upstream/timestamptz-262.sql",
  "original/upstream/timestamptz-263.sql",
  "original/upstream/timestamptz-264.sql",
  "original/upstream/timestamptz-265.sql",
  "original/upstream/timestamptz-266.sql",
  "original/upstream/timestamptz-267.sql",
  "original/upstream/timestamptz-268.sql",
  "original/upstream/timestamptz-269.sql",
  "original/upstream/timestamptz-270.sql",
  "original/upstream/timestamptz-271.sql",
  "original/upstream/timestamptz-272.sql",
  "original/upstream/timestamptz-273.sql",
  "original/upstream/timestamptz-274.sql",
  "original/upstream/timestamptz-275.sql",
  "original/upstream/timestamptz-276.sql",
  "original/upstream/timestamptz-277.sql",
  "original/upstream/timestamptz-278.sql",
  "original/upstream/timestamptz-279.sql",
  "original/upstream/timestamptz-280.sql",
  "original/upstream/timestamptz-281.sql",
  "original/upstream/timestamptz-282.sql",
  "original/upstream/timestamptz-283.sql",
  "original/upstream/timestamptz-284.sql",
  "original/upstream/timestamptz-285.sql",
  "original/upstream/timestamptz-286.sql",
  "original/upstream/timestamptz-287.sql",
  "original/upstream/timestamptz-288.sql",
  "original/upstream/timestamptz-289.sql",
  "original/upstream/timestamptz-290.sql",
  "original/upstream/timestamptz-291.sql",
  "original/upstream/timestamptz-292.sql",
  "original/upstream/timestamptz-293.sql",
  "original/upstream/timestamptz-294.sql",
  "original/upstream/timestamptz-295.sql",
  "original/upstream/timestamptz-296.sql",
  "original/upstream/timestamptz-297.sql",
  "original/upstream/timestamptz-298.sql",
  "original/upstream/timestamptz-299.sql",
  "original/upstream/timestamptz-300.sql",
  "original/upstream/timestamptz-301.sql",
  "original/upstream/timestamptz-302.sql",
  "original/upstream/timestamptz-303.sql",
  "original/upstream/timestamptz-304.sql"
]);
});
