
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(13, 14);

it('original-upstream-triggers', async () => {
  await fixtures.runFixtureTests([
  "original/upstream/triggers-1.sql",
  "original/upstream/triggers-2.sql",
  "original/upstream/triggers-3.sql",
  "original/upstream/triggers-4.sql",
  "original/upstream/triggers-5.sql",
  "original/upstream/triggers-6.sql",
  "original/upstream/triggers-7.sql",
  "original/upstream/triggers-8.sql",
  "original/upstream/triggers-9.sql",
  "original/upstream/triggers-10.sql",
  "original/upstream/triggers-11.sql",
  "original/upstream/triggers-12.sql",
  "original/upstream/triggers-13.sql",
  "original/upstream/triggers-14.sql",
  "original/upstream/triggers-15.sql",
  "original/upstream/triggers-16.sql",
  "original/upstream/triggers-17.sql",
  "original/upstream/triggers-18.sql",
  "original/upstream/triggers-19.sql",
  "original/upstream/triggers-20.sql",
  "original/upstream/triggers-21.sql",
  "original/upstream/triggers-22.sql",
  "original/upstream/triggers-23.sql",
  "original/upstream/triggers-24.sql",
  "original/upstream/triggers-25.sql",
  "original/upstream/triggers-26.sql",
  "original/upstream/triggers-27.sql",
  "original/upstream/triggers-28.sql",
  "original/upstream/triggers-29.sql",
  "original/upstream/triggers-30.sql",
  "original/upstream/triggers-31.sql",
  "original/upstream/triggers-32.sql",
  "original/upstream/triggers-33.sql",
  "original/upstream/triggers-34.sql",
  "original/upstream/triggers-35.sql",
  "original/upstream/triggers-36.sql",
  "original/upstream/triggers-37.sql",
  "original/upstream/triggers-38.sql",
  "original/upstream/triggers-39.sql",
  "original/upstream/triggers-40.sql",
  "original/upstream/triggers-41.sql",
  "original/upstream/triggers-42.sql",
  "original/upstream/triggers-43.sql",
  "original/upstream/triggers-44.sql",
  "original/upstream/triggers-45.sql",
  "original/upstream/triggers-46.sql",
  "original/upstream/triggers-47.sql",
  "original/upstream/triggers-48.sql",
  "original/upstream/triggers-49.sql",
  "original/upstream/triggers-50.sql",
  "original/upstream/triggers-51.sql",
  "original/upstream/triggers-52.sql",
  "original/upstream/triggers-53.sql",
  "original/upstream/triggers-54.sql",
  "original/upstream/triggers-55.sql",
  "original/upstream/triggers-56.sql",
  "original/upstream/triggers-57.sql",
  "original/upstream/triggers-58.sql",
  "original/upstream/triggers-59.sql",
  "original/upstream/triggers-60.sql",
  "original/upstream/triggers-61.sql",
  "original/upstream/triggers-62.sql",
  "original/upstream/triggers-63.sql",
  "original/upstream/triggers-64.sql",
  "original/upstream/triggers-65.sql",
  "original/upstream/triggers-66.sql",
  "original/upstream/triggers-67.sql",
  "original/upstream/triggers-68.sql",
  "original/upstream/triggers-69.sql",
  "original/upstream/triggers-70.sql",
  "original/upstream/triggers-71.sql",
  "original/upstream/triggers-72.sql",
  "original/upstream/triggers-73.sql",
  "original/upstream/triggers-74.sql",
  "original/upstream/triggers-75.sql",
  "original/upstream/triggers-76.sql",
  "original/upstream/triggers-77.sql",
  "original/upstream/triggers-78.sql",
  "original/upstream/triggers-79.sql",
  "original/upstream/triggers-80.sql",
  "original/upstream/triggers-81.sql",
  "original/upstream/triggers-82.sql",
  "original/upstream/triggers-83.sql",
  "original/upstream/triggers-84.sql",
  "original/upstream/triggers-85.sql",
  "original/upstream/triggers-86.sql",
  "original/upstream/triggers-87.sql",
  "original/upstream/triggers-88.sql",
  "original/upstream/triggers-89.sql",
  "original/upstream/triggers-90.sql",
  "original/upstream/triggers-91.sql",
  "original/upstream/triggers-92.sql",
  "original/upstream/triggers-93.sql",
  "original/upstream/triggers-94.sql",
  "original/upstream/triggers-95.sql",
  "original/upstream/triggers-96.sql",
  "original/upstream/triggers-97.sql",
  "original/upstream/triggers-98.sql",
  "original/upstream/triggers-99.sql",
  "original/upstream/triggers-100.sql",
  "original/upstream/triggers-101.sql",
  "original/upstream/triggers-102.sql",
  "original/upstream/triggers-103.sql",
  "original/upstream/triggers-104.sql",
  "original/upstream/triggers-105.sql",
  "original/upstream/triggers-106.sql",
  "original/upstream/triggers-107.sql",
  "original/upstream/triggers-108.sql",
  "original/upstream/triggers-109.sql",
  "original/upstream/triggers-110.sql",
  "original/upstream/triggers-111.sql",
  "original/upstream/triggers-112.sql",
  "original/upstream/triggers-113.sql",
  "original/upstream/triggers-114.sql",
  "original/upstream/triggers-115.sql",
  "original/upstream/triggers-116.sql",
  "original/upstream/triggers-117.sql",
  "original/upstream/triggers-118.sql",
  "original/upstream/triggers-119.sql",
  "original/upstream/triggers-120.sql",
  "original/upstream/triggers-121.sql",
  "original/upstream/triggers-122.sql",
  "original/upstream/triggers-123.sql",
  "original/upstream/triggers-124.sql",
  "original/upstream/triggers-125.sql",
  "original/upstream/triggers-126.sql",
  "original/upstream/triggers-127.sql",
  "original/upstream/triggers-128.sql",
  "original/upstream/triggers-129.sql",
  "original/upstream/triggers-130.sql",
  "original/upstream/triggers-131.sql",
  "original/upstream/triggers-132.sql",
  "original/upstream/triggers-133.sql",
  "original/upstream/triggers-134.sql",
  "original/upstream/triggers-135.sql",
  "original/upstream/triggers-136.sql",
  "original/upstream/triggers-137.sql",
  "original/upstream/triggers-138.sql",
  "original/upstream/triggers-139.sql",
  "original/upstream/triggers-140.sql",
  "original/upstream/triggers-141.sql",
  "original/upstream/triggers-142.sql",
  "original/upstream/triggers-143.sql",
  "original/upstream/triggers-144.sql",
  "original/upstream/triggers-145.sql",
  "original/upstream/triggers-146.sql",
  "original/upstream/triggers-147.sql",
  "original/upstream/triggers-148.sql",
  "original/upstream/triggers-149.sql",
  "original/upstream/triggers-150.sql",
  "original/upstream/triggers-151.sql",
  "original/upstream/triggers-152.sql",
  "original/upstream/triggers-153.sql",
  "original/upstream/triggers-154.sql",
  "original/upstream/triggers-155.sql",
  "original/upstream/triggers-156.sql",
  "original/upstream/triggers-157.sql",
  "original/upstream/triggers-158.sql",
  "original/upstream/triggers-159.sql",
  "original/upstream/triggers-160.sql",
  "original/upstream/triggers-161.sql",
  "original/upstream/triggers-162.sql",
  "original/upstream/triggers-163.sql",
  "original/upstream/triggers-164.sql",
  "original/upstream/triggers-165.sql",
  "original/upstream/triggers-166.sql",
  "original/upstream/triggers-167.sql",
  "original/upstream/triggers-168.sql",
  "original/upstream/triggers-169.sql",
  "original/upstream/triggers-170.sql",
  "original/upstream/triggers-171.sql",
  "original/upstream/triggers-172.sql",
  "original/upstream/triggers-173.sql",
  "original/upstream/triggers-174.sql",
  "original/upstream/triggers-175.sql",
  "original/upstream/triggers-176.sql",
  "original/upstream/triggers-177.sql",
  "original/upstream/triggers-178.sql",
  "original/upstream/triggers-179.sql",
  "original/upstream/triggers-180.sql",
  "original/upstream/triggers-181.sql",
  "original/upstream/triggers-182.sql",
  "original/upstream/triggers-183.sql",
  "original/upstream/triggers-184.sql",
  "original/upstream/triggers-185.sql",
  "original/upstream/triggers-186.sql",
  "original/upstream/triggers-187.sql",
  "original/upstream/triggers-188.sql",
  "original/upstream/triggers-189.sql",
  "original/upstream/triggers-190.sql",
  "original/upstream/triggers-191.sql",
  "original/upstream/triggers-192.sql",
  "original/upstream/triggers-193.sql",
  "original/upstream/triggers-194.sql",
  "original/upstream/triggers-195.sql",
  "original/upstream/triggers-196.sql",
  "original/upstream/triggers-197.sql",
  "original/upstream/triggers-198.sql",
  "original/upstream/triggers-199.sql",
  "original/upstream/triggers-200.sql",
  "original/upstream/triggers-201.sql",
  "original/upstream/triggers-202.sql",
  "original/upstream/triggers-203.sql",
  "original/upstream/triggers-204.sql",
  "original/upstream/triggers-205.sql",
  "original/upstream/triggers-206.sql",
  "original/upstream/triggers-207.sql",
  "original/upstream/triggers-208.sql",
  "original/upstream/triggers-209.sql",
  "original/upstream/triggers-210.sql",
  "original/upstream/triggers-211.sql",
  "original/upstream/triggers-212.sql",
  "original/upstream/triggers-213.sql",
  "original/upstream/triggers-214.sql",
  "original/upstream/triggers-215.sql",
  "original/upstream/triggers-216.sql",
  "original/upstream/triggers-217.sql",
  "original/upstream/triggers-218.sql",
  "original/upstream/triggers-219.sql",
  "original/upstream/triggers-220.sql",
  "original/upstream/triggers-221.sql",
  "original/upstream/triggers-222.sql",
  "original/upstream/triggers-223.sql",
  "original/upstream/triggers-224.sql",
  "original/upstream/triggers-225.sql",
  "original/upstream/triggers-226.sql",
  "original/upstream/triggers-227.sql",
  "original/upstream/triggers-228.sql",
  "original/upstream/triggers-229.sql",
  "original/upstream/triggers-230.sql",
  "original/upstream/triggers-231.sql",
  "original/upstream/triggers-232.sql",
  "original/upstream/triggers-233.sql",
  "original/upstream/triggers-234.sql",
  "original/upstream/triggers-235.sql",
  "original/upstream/triggers-236.sql",
  "original/upstream/triggers-237.sql",
  "original/upstream/triggers-238.sql",
  "original/upstream/triggers-239.sql",
  "original/upstream/triggers-240.sql",
  "original/upstream/triggers-241.sql",
  "original/upstream/triggers-242.sql",
  "original/upstream/triggers-243.sql",
  "original/upstream/triggers-244.sql",
  "original/upstream/triggers-245.sql",
  "original/upstream/triggers-246.sql",
  "original/upstream/triggers-247.sql",
  "original/upstream/triggers-248.sql",
  "original/upstream/triggers-249.sql",
  "original/upstream/triggers-250.sql",
  "original/upstream/triggers-251.sql",
  "original/upstream/triggers-252.sql",
  "original/upstream/triggers-253.sql",
  "original/upstream/triggers-254.sql",
  "original/upstream/triggers-255.sql",
  "original/upstream/triggers-256.sql",
  "original/upstream/triggers-257.sql",
  "original/upstream/triggers-258.sql",
  "original/upstream/triggers-259.sql",
  "original/upstream/triggers-260.sql",
  "original/upstream/triggers-261.sql",
  "original/upstream/triggers-262.sql",
  "original/upstream/triggers-263.sql",
  "original/upstream/triggers-264.sql",
  "original/upstream/triggers-265.sql",
  "original/upstream/triggers-266.sql",
  "original/upstream/triggers-267.sql",
  "original/upstream/triggers-268.sql",
  "original/upstream/triggers-269.sql",
  "original/upstream/triggers-270.sql",
  "original/upstream/triggers-271.sql",
  "original/upstream/triggers-272.sql",
  "original/upstream/triggers-273.sql",
  "original/upstream/triggers-274.sql",
  "original/upstream/triggers-275.sql",
  "original/upstream/triggers-276.sql",
  "original/upstream/triggers-277.sql",
  "original/upstream/triggers-278.sql",
  "original/upstream/triggers-279.sql",
  "original/upstream/triggers-280.sql",
  "original/upstream/triggers-281.sql",
  "original/upstream/triggers-282.sql",
  "original/upstream/triggers-283.sql",
  "original/upstream/triggers-284.sql",
  "original/upstream/triggers-285.sql",
  "original/upstream/triggers-286.sql",
  "original/upstream/triggers-287.sql",
  "original/upstream/triggers-288.sql",
  "original/upstream/triggers-289.sql",
  "original/upstream/triggers-290.sql",
  "original/upstream/triggers-291.sql",
  "original/upstream/triggers-292.sql",
  "original/upstream/triggers-293.sql",
  "original/upstream/triggers-294.sql",
  "original/upstream/triggers-295.sql",
  "original/upstream/triggers-296.sql",
  "original/upstream/triggers-297.sql",
  "original/upstream/triggers-298.sql",
  "original/upstream/triggers-299.sql",
  "original/upstream/triggers-300.sql",
  "original/upstream/triggers-301.sql",
  "original/upstream/triggers-302.sql",
  "original/upstream/triggers-303.sql",
  "original/upstream/triggers-304.sql",
  "original/upstream/triggers-305.sql",
  "original/upstream/triggers-306.sql",
  "original/upstream/triggers-307.sql",
  "original/upstream/triggers-308.sql",
  "original/upstream/triggers-309.sql",
  "original/upstream/triggers-310.sql",
  "original/upstream/triggers-311.sql",
  "original/upstream/triggers-312.sql",
  "original/upstream/triggers-313.sql",
  "original/upstream/triggers-314.sql",
  "original/upstream/triggers-315.sql",
  "original/upstream/triggers-316.sql",
  "original/upstream/triggers-317.sql",
  "original/upstream/triggers-318.sql",
  "original/upstream/triggers-319.sql",
  "original/upstream/triggers-320.sql",
  "original/upstream/triggers-321.sql",
  "original/upstream/triggers-322.sql",
  "original/upstream/triggers-323.sql",
  "original/upstream/triggers-324.sql",
  "original/upstream/triggers-325.sql",
  "original/upstream/triggers-326.sql",
  "original/upstream/triggers-327.sql",
  "original/upstream/triggers-328.sql",
  "original/upstream/triggers-329.sql",
  "original/upstream/triggers-330.sql",
  "original/upstream/triggers-331.sql",
  "original/upstream/triggers-332.sql",
  "original/upstream/triggers-333.sql",
  "original/upstream/triggers-334.sql",
  "original/upstream/triggers-335.sql",
  "original/upstream/triggers-336.sql",
  "original/upstream/triggers-337.sql",
  "original/upstream/triggers-338.sql",
  "original/upstream/triggers-339.sql",
  "original/upstream/triggers-340.sql",
  "original/upstream/triggers-341.sql",
  "original/upstream/triggers-342.sql",
  "original/upstream/triggers-343.sql",
  "original/upstream/triggers-344.sql",
  "original/upstream/triggers-345.sql",
  "original/upstream/triggers-346.sql",
  "original/upstream/triggers-347.sql",
  "original/upstream/triggers-348.sql",
  "original/upstream/triggers-349.sql",
  "original/upstream/triggers-350.sql",
  "original/upstream/triggers-351.sql",
  "original/upstream/triggers-352.sql",
  "original/upstream/triggers-353.sql",
  "original/upstream/triggers-354.sql",
  "original/upstream/triggers-355.sql",
  "original/upstream/triggers-356.sql",
  "original/upstream/triggers-357.sql",
  "original/upstream/triggers-358.sql",
  "original/upstream/triggers-359.sql",
  "original/upstream/triggers-360.sql",
  "original/upstream/triggers-361.sql",
  "original/upstream/triggers-362.sql"
]);
});
